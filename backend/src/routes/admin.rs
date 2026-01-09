use axum::{
    extract::{Path, State},
    routing::{delete, get, patch, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::db;
use crate::error::{AppError, AppResult};
use crate::middlewares::auth::AdminAuth;
use crate::models::PayoutStatus;
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/tokens/cleanup", delete(cleanup_expired_tokens))
        .route(
            "/users/{id}/invalidate-tokens",
            delete(invalidate_user_tokens),
        )
        .route("/payouts/{id}/status", patch(update_payout_status))
        .route("/orders/{id}", get(get_order_details))
        .route("/checkouts/{id}", get(get_checkout_details))
        .route("/email/test", post(send_test_email))
}

#[derive(Debug, Serialize)]
struct CleanupResponse {
    cleaned_count: i64,
}

async fn cleanup_expired_tokens(
    State(state): State<AppState>,
    AdminAuth(_user): AdminAuth,
) -> AppResult<Json<CleanupResponse>> {
    let count = db::token::cleanup_expired_tokens(&state.db).await?;
    Ok(Json(CleanupResponse {
        cleaned_count: count,
    }))
}

#[derive(Debug, Serialize)]
struct MessageResponse {
    message: String,
}

async fn invalidate_user_tokens(
    State(state): State<AppState>,
    AdminAuth(_user): AdminAuth,
    Path(user_id): Path<Uuid>,
) -> AppResult<Json<MessageResponse>> {
    let expires_at = chrono::Utc::now() + chrono::Duration::days(7);
    db::token::blacklist_all_user_tokens(&state.db, user_id, expires_at).await?;
    Ok(Json(MessageResponse {
        message: format!("All tokens for user {} have been invalidated", user_id),
    }))
}

#[derive(Debug, Deserialize)]
struct UpdatePayoutStatusInput {
    status: String,
    failure_reason: Option<String>,
}

async fn update_payout_status(
    State(state): State<AppState>,
    AdminAuth(_user): AdminAuth,
    Path(payout_id): Path<Uuid>,
    Json(input): Json<UpdatePayoutStatusInput>,
) -> AppResult<Json<MessageResponse>> {
    let status = match input.status.to_lowercase().as_str() {
        "pending" => PayoutStatus::Pending,
        "processing" => PayoutStatus::Processing,
        "paid" => PayoutStatus::Paid,
        "failed" => PayoutStatus::Failed,
        _ => return Err(AppError::BadRequest("Invalid payout status".into())),
    };

    db::payout::update_payout_status(
        &state.db,
        payout_id,
        status,
        input.failure_reason.as_deref(),
    )
    .await?;

    Ok(Json(MessageResponse {
        message: format!("Payout {} status updated to {:?}", payout_id, status),
    }))
}

async fn get_order_details(
    State(state): State<AppState>,
    AdminAuth(_user): AdminAuth,
    Path(order_id): Path<String>,
) -> AppResult<Json<serde_json::Value>> {
    let payments = state.require_payments()?;
    let order = payments.get_order(&order_id).await?;
    Ok(Json(serde_json::json!({
        "id": order.id,
        "type": order.data_type,
        "attributes": order.attributes
    })))
}

async fn get_checkout_details(
    State(state): State<AppState>,
    AdminAuth(_user): AdminAuth,
    Path(checkout_id): Path<String>,
) -> AppResult<Json<serde_json::Value>> {
    let payments = state.require_payments()?;
    let checkout = payments.get_checkout(&checkout_id).await?;
    Ok(Json(serde_json::json!({
        "id": checkout.id,
        "type": checkout.data_type,
        "url": checkout.attributes.url,
        "expires_at": checkout.attributes.expires_at,
        "test_mode": checkout.attributes.test_mode
    })))
}

#[derive(Debug, Deserialize)]
struct TestEmailInput {
    to: String,
    subject: Option<String>,
}

async fn send_test_email(
    State(state): State<AppState>,
    AdminAuth(_user): AdminAuth,
    Json(input): Json<TestEmailInput>,
) -> AppResult<Json<MessageResponse>> {
    let email_service = state.require_email()?;

    let subject = input
        .subject
        .unwrap_or_else(|| "Test Email from Adsloty".to_string());

    email_service
        .send_raw(
            &input.to,
            &subject,
            "This is a test email from Adsloty admin panel.",
        )
        .await?;

    Ok(Json(MessageResponse {
        message: format!("Test email sent to {}", input.to),
    }))
}
