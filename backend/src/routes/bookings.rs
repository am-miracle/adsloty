use axum::{
    extract::{Path, Query, State},
    routing::{get, patch, post},
    Json, Router,
};
use chrono::NaiveDate;
use serde::Deserialize;
use uuid::Uuid;

use crate::db;
use crate::db::sponsor::{BookingFilters, BookingSortBy, CreateBookingError};
use crate::error::{AppError, AppResult};
use crate::helpers::{
    get_booking_or_404, get_sponsor_for_user_or_404, get_writer_for_user_or_404, get_writer_or_404,
    require_booking_ownership_by_writer,
};
use crate::middlewares::{SponsorAuth, WriterAuth};
use crate::models::{BookingStatus, BookingWithDetails, CreateBooking};
use crate::responses::{DataResponse, PaginatedResponse, PaginationParams, SuccessResponse};
use crate::services::{
    BookingPublishedData, BookingRejectedData, BookingStatusData, CreateCheckoutParams,
};
use crate::state::AppState;
use crate::validation;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_booking))
        .route("/sponsor", get(get_sponsor_bookings))
        .route("/writer", get(get_writer_bookings))
        .route("/{id}", get(get_booking).patch(update_booking_ad_content))
        .route("/{id}/approve", patch(approve_booking))
        .route("/{id}/reject", patch(reject_booking))
        .route("/{id}/mark-published", patch(mark_published))
}

#[derive(Debug, serde::Serialize)]
struct CreateBookingData {
    booking_id: Uuid,
    checkout_url: String,
}

async fn create_booking(
    State(state): State<AppState>,
    SponsorAuth(user): SponsorAuth,
    Json(input): Json<CreateBooking>,
) -> AppResult<Json<DataResponse<CreateBookingData>>> {
    let sanitized = validation::validate_booking_ad_content(
        &input.ad_headline,
        &input.ad_body,
        input.ad_cta_text.as_deref(),
        &input.ad_cta_url,
        input.ad_image_url.as_deref(),
    )?;

    let sponsor = get_sponsor_for_user_or_404(&state.db, user.id).await?;
    let writer = get_writer_or_404(&state.db, input.writer_id).await?;

    let today = chrono::Utc::now().date_naive();
    let min_date = today + chrono::Duration::days(writer.lead_time_days as i64);
    if input.slot_date < min_date {
        return Err(AppError::BadRequest(format!(
            "Slot date must be at least {} days in the future",
            writer.lead_time_days
        )));
    }

    let payments = state.require_payments()?;

    let sponsor_email = sponsor.billing_email.clone().ok_or_else(|| {
        AppError::BadRequest(
            "Billing email is required to create a booking. Please update your sponsor profile."
                .into(),
        )
    })?;

    let checkout_params = CreateCheckoutParams {
        booking_id: Uuid::now_v7().to_string(),
        writer_id: writer.id.to_string(),
        sponsor_id: sponsor.id.to_string(),
        sponsor_email,
        newsletter_name: writer.newsletter_name.clone(),
        slot_date: input.slot_date.to_string(),
        amount_cents: writer.price_per_slot as i64,
        success_url: format!(
            "{}/bookings/success?session_id={{CHECKOUT_SESSION_ID}}",
            state.config.server.frontend_url
        ),
        expires_at: None,
    };

    let checkout = payments.create_checkout(checkout_params).await?;

    let booking = db::sponsor::create_booking_with_availability_check(
        &state.db,
        sponsor.id,
        &writer,
        input.slot_date,
        &sanitized,
        &checkout.checkout_id,
    )
    .await
    .map_err(|e| match e {
        CreateBookingError::SlotNotAvailable => {
            AppError::Conflict("This slot is no longer available".into())
        }
        CreateBookingError::Database(err) => AppError::from(err),
    })?;

    Ok(Json(DataResponse::new(CreateBookingData {
        booking_id: booking.id,
        checkout_url: checkout.checkout_url,
    })))
}

async fn get_booking(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<DataResponse<BookingWithDetails>>> {
    let writer = get_writer_for_user_or_404(&state.db, user.id).await?;

    let bookings = db::sponsor::get_writer_bookings(&state.db, writer.id).await?;

    let booking = bookings
        .into_iter()
        .find(|b| b.id == id)
        .ok_or_else(|| AppError::NotFound("Booking not found".into()))?;

    Ok(Json(DataResponse::new(booking)))
}

#[derive(Debug, Deserialize)]
struct BookingListQuery {
    #[serde(default = "default_limit")]
    limit: i32,
    #[serde(default)]
    offset: i32,
    status: Option<String>,
    from_date: Option<NaiveDate>,
    to_date: Option<NaiveDate>,
    #[serde(default)]
    sort_by: Option<String>,
}

fn default_limit() -> i32 {
    20
}

impl BookingListQuery {
    fn to_filters(&self) -> BookingFilters {
        BookingFilters {
            status: self.status.as_ref().and_then(|s| parse_booking_status(s)),
            from_date: self.from_date,
            to_date: self.to_date,
        }
    }

    fn to_sort_by(&self) -> BookingSortBy {
        self.sort_by
            .as_ref()
            .map(|s| match s.as_str() {
                "slot_date_asc" => BookingSortBy::SlotDateAsc,
                "slot_date_desc" => BookingSortBy::SlotDateDesc,
                "created_at_asc" => BookingSortBy::CreatedAtAsc,
                "created_at_desc" => BookingSortBy::CreatedAtDesc,
                "amount_asc" => BookingSortBy::AmountAsc,
                "amount_desc" => BookingSortBy::AmountDesc,
                _ => BookingSortBy::default(),
            })
            .unwrap_or_default()
    }

    fn pagination(&self) -> PaginationParams {
        PaginationParams {
            limit: self.limit,
            offset: self.offset,
        }
        .validated()
    }
}

fn parse_booking_status(s: &str) -> Option<BookingStatus> {
    match s.to_lowercase().as_str() {
        "pending_payment" => Some(BookingStatus::PendingPayment),
        "paid" => Some(BookingStatus::Paid),
        "approved" => Some(BookingStatus::Approved),
        "rejected" => Some(BookingStatus::Rejected),
        "published" => Some(BookingStatus::Published),
        "cancelled" => Some(BookingStatus::Cancelled),
        "refunded" => Some(BookingStatus::Refunded),
        _ => None,
    }
}

async fn get_sponsor_bookings(
    State(state): State<AppState>,
    SponsorAuth(user): SponsorAuth,
    Query(query): Query<BookingListQuery>,
) -> AppResult<Json<PaginatedResponse<BookingWithDetails>>> {
    let sponsor = get_sponsor_for_user_or_404(&state.db, user.id).await?;
    let pagination = query.pagination();
    let filters = query.to_filters();
    let sort_by = query.to_sort_by();

    let result = db::sponsor::get_sponsor_bookings_paginated(
        &state.db,
        sponsor.id,
        pagination.limit,
        pagination.offset,
        &filters,
        sort_by,
    )
    .await?;

    Ok(Json(PaginatedResponse::new(
        result.bookings,
        result.total,
        pagination.limit,
        pagination.offset,
    )))
}

async fn get_writer_bookings(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Query(query): Query<BookingListQuery>,
) -> AppResult<Json<PaginatedResponse<BookingWithDetails>>> {
    let writer = get_writer_for_user_or_404(&state.db, user.id).await?;
    let pagination = query.pagination();
    let filters = query.to_filters();
    let sort_by = query.to_sort_by();

    let result = db::sponsor::get_writer_bookings_paginated(
        &state.db,
        writer.id,
        pagination.limit,
        pagination.offset,
        &filters,
        sort_by,
    )
    .await?;

    Ok(Json(PaginatedResponse::new(
        result.bookings,
        result.total,
        pagination.limit,
        pagination.offset,
    )))
}

#[derive(Debug, Deserialize)]
struct UpdateAdContentInput {
    ad_headline: String,
    ad_body: String,
    ad_cta_text: Option<String>,
    ad_cta_url: String,
    ad_image_url: Option<String>,
}

async fn update_booking_ad_content(
    State(state): State<AppState>,
    SponsorAuth(user): SponsorAuth,
    Path(id): Path<Uuid>,
    Json(input): Json<UpdateAdContentInput>,
) -> AppResult<Json<DataResponse<BookingWithDetails>>> {
    let sponsor = get_sponsor_for_user_or_404(&state.db, user.id).await?;
    let booking = get_booking_or_404(&state.db, id).await?;

    if booking.sponsor_id != sponsor.id {
        return Err(AppError::Forbidden);
    }

    if booking.status != BookingStatus::PendingPayment && booking.status != BookingStatus::Paid {
        return Err(AppError::BadRequest(
            "Can only edit ad content before the booking is approved".into(),
        ));
    }

    let sanitized = validation::validate_booking_ad_content(
        &input.ad_headline,
        &input.ad_body,
        input.ad_cta_text.as_deref(),
        &input.ad_cta_url,
        input.ad_image_url.as_deref(),
    )?;

    db::sponsor::update_booking_ad_content(&state.db, id, &sanitized).await?;

    let bookings = db::sponsor::get_sponsor_bookings(&state.db, sponsor.id).await?;
    let updated_booking = bookings
        .into_iter()
        .find(|b| b.id == id)
        .ok_or_else(|| AppError::NotFound("Booking not found".into()))?;

    Ok(Json(DataResponse::new(updated_booking)))
}

#[derive(Debug, Deserialize)]
struct RejectBookingInput {
    reason: Option<String>,
}

async fn approve_booking(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<SuccessResponse>> {
    let writer = get_writer_for_user_or_404(&state.db, user.id).await?;
    let booking = get_booking_or_404(&state.db, id).await?;
    require_booking_ownership_by_writer(&booking, writer.id)?;

    if booking.status != BookingStatus::Paid {
        return Err(AppError::BadRequest(
            "Can only approve bookings that are paid".into(),
        ));
    }

    db::sponsor::update_booking_status(&state.db, id, BookingStatus::Approved).await?;

    // Send email notification to sponsor
    if let Some(email_service) = &state.email {
        if let Some(sponsor) = db::sponsor::get_sponsor_by_id(&state.db, booking.sponsor_id).await?
        {
            if let Some(billing_email) = &sponsor.billing_email {
                let email_data = BookingStatusData {
                    newsletter_name: writer.newsletter_name.clone(),
                    slot_date: booking.slot_date.to_string(),
                    dashboard_url: format!(
                        "{}/dashboard/bookings",
                        state.config.server.frontend_url
                    ),
                };
                if let Err(e) = email_service
                    .send_booking_approved(billing_email, email_data)
                    .await
                {
                    tracing::warn!("Failed to send approval email: {}", e);
                }
            }
        }
    }

    Ok(Json(SuccessResponse::new("Booking approved successfully")))
}

async fn reject_booking(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
    Json(input): Json<RejectBookingInput>,
) -> AppResult<Json<SuccessResponse>> {
    let writer = get_writer_for_user_or_404(&state.db, user.id).await?;
    let booking = get_booking_or_404(&state.db, id).await?;
    require_booking_ownership_by_writer(&booking, writer.id)?;

    if booking.status != BookingStatus::Paid && booking.status != BookingStatus::Approved {
        return Err(AppError::BadRequest(
            "Can only reject bookings that are paid or approved".into(),
        ));
    }

    if let Some(order_id) = &booking.lemon_order_id {
        let payments = state.require_payments()?;
        payments.refund_order(order_id).await?;
    }

    db::sponsor::update_booking_status(&state.db, id, BookingStatus::Rejected).await?;

    // Send email notification to sponsor with rejection reason
    if let Some(email_service) = &state.email {
        if let Some(sponsor) = db::sponsor::get_sponsor_by_id(&state.db, booking.sponsor_id).await?
        {
            if let Some(billing_email) = &sponsor.billing_email {
                let email_data = BookingRejectedData {
                    newsletter_name: writer.newsletter_name.clone(),
                    slot_date: booking.slot_date.to_string(),
                    amount_cents: booking.amount_cents,
                    currency: booking.currency.clone(),
                    reason: input.reason.clone(),
                };
                if let Err(e) = email_service
                    .send_booking_rejected(billing_email, email_data)
                    .await
                {
                    tracing::warn!("Failed to send rejection email: {}", e);
                }
            }
        }
    }

    let message = format!(
        "Booking rejected{}",
        input
            .reason
            .map(|r| format!(" - Reason: {}", r))
            .unwrap_or_default()
    );

    Ok(Json(SuccessResponse::new(message)))
}

async fn mark_published(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<SuccessResponse>> {
    let writer = get_writer_for_user_or_404(&state.db, user.id).await?;
    let booking = get_booking_or_404(&state.db, id).await?;
    require_booking_ownership_by_writer(&booking, writer.id)?;

    if booking.status != BookingStatus::Approved {
        return Err(AppError::BadRequest(
            "Can only mark approved bookings as published".into(),
        ));
    }

    db::sponsor::update_booking_status(&state.db, id, BookingStatus::Published).await?;

    // Send email notification to sponsor that their ad was published
    if let Some(email_service) = &state.email {
        if let Some(sponsor) = db::sponsor::get_sponsor_by_id(&state.db, booking.sponsor_id).await?
        {
            if let Some(billing_email) = &sponsor.billing_email {
                let email_data = BookingPublishedData {
                    newsletter_name: writer.newsletter_name.clone(),
                    slot_date: booking.slot_date.to_string(),
                    subscriber_count: writer.subscriber_count,
                    ad_headline: booking.ad_headline.clone(),
                    ad_body: booking.ad_body.clone(),
                    ad_cta_text: booking.ad_cta_text.clone(),
                    ad_cta_url: booking.ad_cta_url.clone(),
                    dashboard_url: format!(
                        "{}/dashboard/bookings",
                        state.config.server.frontend_url
                    ),
                };
                if let Err(e) = email_service
                    .send_booking_published(billing_email, email_data)
                    .await
                {
                    tracing::warn!("Failed to send published email: {}", e);
                }
            }
        }
    }

    Ok(Json(SuccessResponse::new("Booking marked as published")))
}
