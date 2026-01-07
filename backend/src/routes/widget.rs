use axum::{
    extract::{Path, Query, State},
    routing::get,
    Json, Router,
};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::db;
use crate::error::AppResult;
use crate::helpers::get_writer_or_404;
use crate::models::AvailableSlot;
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/writers/{id}", get(get_writer_info))
        .route("/writers/{id}/availability", get(writer_availability))
        .route("/writers/{id}/slots/{date}", get(check_slot))
}

#[derive(Debug, Serialize)]
struct WidgetWriterInfo {
    id: Uuid,
    newsletter_name: String,
    newsletter_url: Option<String>,
    description: Option<String>,
    subscriber_count: Option<i32>,
    price_per_slot: i32,
    currency: String,
    lead_time_days: i32,
    slots_per_week: i32,
}

async fn get_writer_info(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<WidgetWriterInfo>> {
    let writer = get_writer_or_404(&state.db, id).await?;

    Ok(Json(WidgetWriterInfo {
        id: writer.id,
        newsletter_name: writer.newsletter_name,
        newsletter_url: writer.newsletter_url,
        description: writer.description,
        subscriber_count: writer.subscriber_count,
        price_per_slot: writer.price_per_slot,
        currency: writer.currency,
        lead_time_days: writer.lead_time_days,
        slots_per_week: writer.slots_per_week,
    }))
}

#[derive(Debug, Deserialize)]
struct AvailabilityQuery {
    #[serde(default = "default_weeks")]
    weeks: i32,
}

fn default_weeks() -> i32 {
    8
}

#[derive(Debug, Serialize)]
struct WidgetAvailability {
    writer_id: Uuid,
    newsletter_name: String,
    price_per_slot: i32,
    currency: String,
    lead_time_days: i32,
    available_slots: Vec<AvailableSlot>,
}

async fn writer_availability(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(query): Query<AvailabilityQuery>,
) -> AppResult<Json<WidgetAvailability>> {
    let writer = get_writer_or_404(&state.db, id).await?;

    let available_slots =
        db::availability::get_writer_availability(&state.db, id, query.weeks).await?;

    Ok(Json(WidgetAvailability {
        writer_id: writer.id,
        newsletter_name: writer.newsletter_name,
        price_per_slot: writer.price_per_slot,
        currency: writer.currency,
        lead_time_days: writer.lead_time_days,
        available_slots,
    }))
}

#[derive(Debug, Serialize)]
struct SlotCheckResponse {
    available: bool,
    slot_date: NaiveDate,
    slots_remaining: i32,
    price_cents: i32,
    currency: String,
}

async fn check_slot(
    State(state): State<AppState>,
    Path((id, date)): Path<(Uuid, NaiveDate)>,
) -> AppResult<Json<SlotCheckResponse>> {
    let writer = get_writer_or_404(&state.db, id).await?;

    let today = chrono::Utc::now().date_naive();
    let min_date = today + chrono::Duration::days(writer.lead_time_days as i64);
    if date < min_date {
        return Ok(Json(SlotCheckResponse {
            available: false,
            slot_date: date,
            slots_remaining: 0,
            price_cents: writer.price_per_slot,
            currency: writer.currency,
        }));
    }

    let is_available = db::availability::is_slot_available(&state.db, id, date).await?;

    let availability = db::availability::get_writer_availability(&state.db, id, 12).await?;
    let slots_remaining = availability
        .iter()
        .find(|s| s.available_date == date)
        .map(|s| s.slots_remaining)
        .unwrap_or(0);

    Ok(Json(SlotCheckResponse {
        available: is_available,
        slot_date: date,
        slots_remaining,
        price_cents: writer.price_per_slot,
        currency: writer.currency,
    }))
}
