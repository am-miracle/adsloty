use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "payout_status", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum PayoutStatus {
    Pending,
    Processing,
    Paid,
    Failed,
}

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Payout {
    pub id: Uuid,
    pub writer_id: Uuid,

    pub amount_cents: i32,
    pub currency: String,

    pub status: PayoutStatus,

    #[serde(skip_serializing)]
    pub lemon_payout_id: Option<String>,

    pub booking_ids: Vec<Uuid>,

    pub created_at: DateTime<Utc>,
    pub paid_at: Option<DateTime<Utc>>,
    pub failed_at: Option<DateTime<Utc>>,
    pub failure_reason: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RequestPayout {
    pub booking_ids: Option<Vec<Uuid>>,
}

#[derive(Debug, Serialize)]
pub struct PayoutSummary {
    pub available_amount_cents: i64,
    pub pending_amount_cents: i64,
    pub total_paid_cents: i64,
    pub eligible_booking_count: i64,
}
