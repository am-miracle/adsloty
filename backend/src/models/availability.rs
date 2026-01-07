use chrono::NaiveDate;
use serde::Serialize;
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct AvailableSlot {
    pub available_date: NaiveDate,
    pub slots_remaining: i32,
}

#[derive(Debug, Serialize)]
pub struct WriterAvailability {
    pub writer_id: uuid::Uuid,
    pub newsletter_name: String,
    pub price_per_slot: i32,
    pub currency: String,
    pub available_slots: Vec<AvailableSlot>,
}
