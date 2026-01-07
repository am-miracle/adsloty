use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Writer {
    pub id: Uuid,
    pub user_id: Uuid,

    pub newsletter_name: String,
    pub newsletter_url: Option<String>,
    pub description: Option<String>,
    pub subscriber_count: Option<i32>,

    pub price_per_slot: i32,
    pub currency: String,

    pub lead_time_days: i32,
    pub slots_per_week: i32,

    pub auto_approve: bool,
    pub platform_fee_pct: rust_decimal::Decimal,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateWriter {
    pub newsletter_name: String,
    pub newsletter_url: Option<String>,
    pub description: Option<String>,
    pub subscriber_count: Option<i32>,
    pub price_per_slot: i32,
    #[serde(default = "default_currency")]
    pub currency: String,
    #[serde(default = "default_lead_time")]
    pub lead_time_days: i32,
    #[serde(default = "default_slots_per_week")]
    pub slots_per_week: i32,
}

fn default_currency() -> String {
    "usd".to_string()
}

fn default_lead_time() -> i32 {
    7
}

fn default_slots_per_week() -> i32 {
    1
}

#[derive(Debug, Deserialize)]
pub struct UpdateWriter {
    pub newsletter_name: Option<String>,
    pub newsletter_url: Option<String>,
    pub description: Option<String>,
    pub subscriber_count: Option<i32>,
    pub price_per_slot: Option<i32>,
    pub lead_time_days: Option<i32>,
    pub slots_per_week: Option<i32>,
    pub auto_approve: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct WriterStats {
    pub total_published: i64,
    pub pending_bookings: i64,
    pub total_revenue_cents: i64,
    pub pending_revenue_cents: i64,
}
