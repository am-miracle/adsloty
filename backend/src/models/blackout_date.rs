use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct BlackoutDate {
    pub id: Uuid,
    pub writer_id: Uuid,
    pub blocked_date: NaiveDate,
    pub reason: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBlackoutDate {
    pub blocked_date: NaiveDate,
    pub reason: Option<String>,
}
