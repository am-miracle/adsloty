use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use serde::Serialize;

use crate::db;
use crate::error::{AppError, AppResult};
use crate::helpers::get_writer_for_user_or_404;
use crate::middlewares::WriterAuth;
use crate::models::{Payout, RequestPayout};
use crate::services::email::PayoutNotificationData;
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(get_payouts))
        .route("/request", post(request_payout))
        .route("/summary", get(get_payout_summary))
}

#[derive(Debug, Serialize)]
struct PayoutSummary {
    available_amount_cents: i64,
    pending_amount_cents: i64,
    total_paid_cents: i64,
    eligible_booking_count: i64,
}

async fn get_payouts(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
) -> AppResult<Json<Vec<Payout>>> {
    let writer = get_writer_for_user_or_404(&state.db, user.id).await?;
    let payouts = db::payout::get_writer_payouts(&state.db, writer.id).await?;
    Ok(Json(payouts))
}

async fn get_payout_summary(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
) -> AppResult<Json<PayoutSummary>> {
    let writer = get_writer_for_user_or_404(&state.db, user.id).await?;

    let eligible_bookings =
        db::payout::get_eligible_bookings_for_payout(&state.db, writer.id).await?;
    let payouts = db::payout::get_writer_payouts(&state.db, writer.id).await?;

    let available_amount_cents: i64 = eligible_bookings
        .iter()
        .map(|b| b.writer_payout_cents as i64)
        .sum();

    let pending_amount_cents: i64 = payouts
        .iter()
        .filter(|p| p.status == crate::models::PayoutStatus::Processing)
        .map(|p| p.amount_cents as i64)
        .sum();

    let total_paid_cents: i64 = payouts
        .iter()
        .filter(|p| p.status == crate::models::PayoutStatus::Paid)
        .map(|p| p.amount_cents as i64)
        .sum();

    Ok(Json(PayoutSummary {
        available_amount_cents,
        pending_amount_cents,
        total_paid_cents,
        eligible_booking_count: eligible_bookings.len() as i64,
    }))
}

async fn request_payout(
    State(state): State<AppState>,
    WriterAuth(user): WriterAuth,
    Json(input): Json<RequestPayout>,
) -> AppResult<Json<Payout>> {
    let writer = get_writer_for_user_or_404(&state.db, user.id).await?;

    let eligible_bookings =
        db::payout::get_eligible_bookings_for_payout(&state.db, writer.id).await?;

    if eligible_bookings.is_empty() {
        return Err(AppError::BadRequest(
            "No eligible bookings for payout".into(),
        ));
    }

    let bookings_to_payout = match &input.booking_ids {
        Some(ids) => eligible_bookings
            .into_iter()
            .filter(|b| ids.contains(&b.id))
            .collect::<Vec<_>>(),
        None => eligible_bookings,
    };

    if bookings_to_payout.is_empty() {
        return Err(AppError::BadRequest("No matching eligible bookings".into()));
    }

    let total_amount: i32 = bookings_to_payout
        .iter()
        .map(|b| b.writer_payout_cents)
        .sum();

    let booking_ids: Vec<_> = bookings_to_payout.iter().map(|b| b.id).collect();
    let currency = bookings_to_payout
        .first()
        .map(|b| b.currency.clone())
        .unwrap_or_else(|| "usd".to_string());

    // Create payout record (in real app, would initiate actual payout via payment provider)
    let payout_id = format!("payout_{}", uuid::Uuid::now_v7());
    let payout = db::payout::create_payout(
        &state.db,
        writer.id,
        total_amount,
        &currency,
        &booking_ids,
        &payout_id,
    )
    .await?;

    // Send notification email
    if let Some(email_service) = &state.email {
        let user_record = db::user::get_user_by_id(&state.db, user.id).await?;
        if let Some(user_record) = user_record {
            let email_data = PayoutNotificationData {
                amount_cents: total_amount,
                currency: currency.clone(),
                booking_count: booking_ids.len(),
                dashboard_url: format!("{}/dashboard/payouts", state.config.server.frontend_url),
            };
            if let Err(e) = email_service
                .send_payout_notification(&user_record.email, email_data)
                .await
            {
                tracing::warn!("Failed to send payout notification email: {}", e);
            }
        }
    }

    Ok(Json(payout))
}
