use axum::{
    extract::{Path, Query, State},
    routing::{delete, get, patch, post},
    Json, Router,
};
use chrono::NaiveDate;
use serde::Deserialize;
use uuid::Uuid;

use crate::db;
use crate::error::{AppError, AppResult};
use crate::helpers::{get_writer_for_user_or_404, get_writer_or_404, require_writer_ownership};
use crate::middlewares::{Auth, WriterAuth};
use crate::models::{
    BlackoutDate, BookingWithDetails, CreateBlackoutDate, CreateWriter, Payout, PayoutSummary,
    UpdateWriter, UserRole, Writer, WriterAvailability, WriterStats,
};
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_writer))
        .route("/me", get(get_my_writer_profile))
        .route("/{id}", get(get_writer))
        .route("/{id}", patch(update_writer))
        .route("/{id}/bookings", get(list_bookings))
        .route("/{id}/bookings/upcoming", get(upcoming_bookings))
        .route("/{id}/availability", get(get_availability))
        .route("/{id}/blackout-dates", get(list_blackout_dates))
        .route("/{id}/blackout-dates", post(create_blackout))
        .route("/{id}/blackout-dates/{date}", delete(delete_blackout))
        .route("/{id}/stats", get(get_stats))
        .route("/{id}/payouts", get(list_payouts))
        .route("/{id}/payouts/summary", get(get_payout_summary))
        .route("/{id}/payouts/request", post(request_payout))
}

async fn create_writer(
    State(state): State<AppState>,
    Auth(user): Auth,
    Json(input): Json<CreateWriter>,
) -> AppResult<Json<Writer>> {
    if user.role != UserRole::Writer && user.role != UserRole::Admin {
        return Err(AppError::Forbidden);
    }

    let existing = db::writer::get_writer_by_user_id(&state.db, user.id).await?;
    if existing.is_some() {
        return Err(AppError::Conflict("Writer profile already exists".into()));
    }

    if input.newsletter_name.trim().is_empty() {
        return Err(AppError::Validation("Newsletter name is required".into()));
    }

    if input.price_per_slot <= 0 {
        return Err(AppError::Validation(
            "Price per slot must be greater than 0".into(),
        ));
    }

    let writer = db::writer::create_writer(&state.db, user.id, &input).await?;

    Ok(Json(writer))
}

async fn get_my_writer_profile(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
) -> AppResult<Json<Writer>> {
    let writer = get_writer_for_user_or_404(&state.db, user.id).await?;
    Ok(Json(writer))
}

async fn get_writer(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Writer>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    Ok(Json(writer))
}

async fn update_writer(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
    Json(input): Json<UpdateWriter>,
) -> AppResult<Json<Writer>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    if let Some(ref name) = input.newsletter_name {
        if name.trim().is_empty() {
            return Err(AppError::Validation(
                "Newsletter name cannot be empty".into(),
            ));
        }
    }

    if let Some(price) = input.price_per_slot {
        if price <= 0 {
            return Err(AppError::Validation(
                "Price per slot must be greater than 0".into(),
            ));
        }
    }

    let updated = db::writer::update_writer(&state.db, id, &input).await?;

    Ok(Json(updated))
}

async fn list_bookings(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Vec<BookingWithDetails>>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    let bookings = db::sponsor::get_writer_bookings(&state.db, id).await?;

    Ok(Json(bookings))
}

#[derive(Debug, Deserialize)]
struct UpcomingBookingsQuery {
    #[serde(default = "default_weeks")]
    weeks: i32,
}

fn default_weeks() -> i32 {
    4
}

async fn upcoming_bookings(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
    Query(query): Query<UpcomingBookingsQuery>,
) -> AppResult<Json<Vec<BookingWithDetails>>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    let bookings = db::sponsor::get_writer_upcoming_bookings(&state.db, id, query.weeks).await?;

    Ok(Json(bookings))
}

#[derive(Debug, Deserialize)]
struct AvailabilityQuery {
    #[serde(default = "default_availability_weeks")]
    weeks: i32,
}

fn default_availability_weeks() -> i32 {
    8
}

async fn get_availability(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(query): Query<AvailabilityQuery>,
) -> AppResult<Json<WriterAvailability>> {
    let writer = get_writer_or_404(&state.db, id).await?;

    let available_slots =
        db::availability::get_writer_availability(&state.db, id, query.weeks).await?;

    Ok(Json(WriterAvailability {
        writer_id: writer.id,
        newsletter_name: writer.newsletter_name,
        price_per_slot: writer.price_per_slot,
        currency: writer.currency,
        available_slots,
    }))
}

async fn list_blackout_dates(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Vec<BlackoutDate>>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    let blackout_dates = db::blackout::get_writer_blackout_dates(&state.db, id).await?;

    Ok(Json(blackout_dates))
}

async fn create_blackout(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
    Json(input): Json<CreateBlackoutDate>,
) -> AppResult<Json<BlackoutDate>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    let today = chrono::Utc::now().date_naive();
    if input.blocked_date <= today {
        return Err(AppError::Validation(
            "Blackout date must be in the future".into(),
        ));
    }

    let blackout = db::blackout::create_blackout_date(&state.db, id, &input).await?;

    Ok(Json(blackout))
}

async fn delete_blackout(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path((id, date)): Path<(Uuid, NaiveDate)>,
) -> AppResult<Json<MessageResponse>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    let deleted = db::blackout::delete_blackout_date(&state.db, id, date).await?;

    if deleted {
        Ok(Json(MessageResponse {
            message: "Blackout date deleted".into(),
        }))
    } else {
        Err(AppError::NotFound("Blackout date not found".into()))
    }
}

async fn get_stats(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<WriterStats>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    let stats = db::writer::get_writer_stats(&state.db, id).await?;

    Ok(Json(stats))
}

async fn list_payouts(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Vec<Payout>>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    let payouts = db::payout::get_writer_payouts(&state.db, id).await?;

    Ok(Json(payouts))
}

async fn get_payout_summary(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<PayoutSummary>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    let eligible_bookings = db::payout::get_eligible_bookings_for_payout(&state.db, id).await?;

    let available_amount: i64 = eligible_bookings
        .iter()
        .map(|b| b.writer_payout_cents as i64)
        .sum();

    let stats = db::writer::get_writer_stats(&state.db, id).await?;

    Ok(Json(PayoutSummary {
        available_amount_cents: available_amount,
        pending_amount_cents: stats.pending_revenue_cents,
        total_paid_cents: stats.total_revenue_cents,
        eligible_booking_count: eligible_bookings.len() as i64,
    }))
}

async fn request_payout(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<MessageResponse>> {
    let writer = get_writer_or_404(&state.db, id).await?;
    require_writer_ownership(&writer, user.id, user.is_admin())?;

    let eligible_bookings = db::payout::get_eligible_bookings_for_payout(&state.db, id).await?;

    if eligible_bookings.is_empty() {
        return Err(AppError::BadRequest(
            "No eligible bookings for payout".into(),
        ));
    }

    let total_amount: i32 = eligible_bookings
        .iter()
        .map(|b| b.writer_payout_cents)
        .sum();

    let booking_ids: Vec<Uuid> = eligible_bookings.iter().map(|b| b.id).collect();

    // Create payout record
    // Note: With Lemon Squeezy, payouts are handled automatically
    let _payout = db::payout::create_payout(
        &state.db,
        id,
        total_amount,
        &writer.currency,
        &booking_ids,
        "pending",
    )
    .await?;

    Ok(Json(MessageResponse {
        message: format!(
            "Payout of {} {} requested for {} bookings",
            total_amount as f64 / 100.0,
            writer.currency.to_uppercase(),
            booking_ids.len()
        ),
    }))
}

#[derive(Debug, serde::Serialize)]
struct MessageResponse {
    message: String,
}
