use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "booking_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum BookingStatus {
    PendingPayment,
    Paid,
    Approved,
    Rejected,
    Published,
    Cancelled,
    Refunded,
}

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Booking {
    pub id: Uuid,
    pub writer_id: Uuid,
    pub sponsor_id: Uuid,

    pub slot_date: NaiveDate,

    pub ad_headline: String,
    pub ad_body: String,
    pub ad_cta_text: Option<String>,
    pub ad_cta_url: String,
    pub ad_image_url: Option<String>,

    pub status: BookingStatus,

    pub amount_cents: i32,
    pub platform_fee_cents: i32,
    pub writer_payout_cents: i32,
    pub currency: String,

    #[serde(skip_serializing)]
    pub lemon_order_id: Option<String>,

    pub created_at: DateTime<Utc>,
    pub paid_at: Option<DateTime<Utc>>,
    pub approved_at: Option<DateTime<Utc>>,
    pub rejected_at: Option<DateTime<Utc>>,
    pub published_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBooking {
    pub writer_id: Uuid,
    pub slot_date: NaiveDate,
    pub ad_headline: String,
    pub ad_body: String,
    pub ad_cta_text: Option<String>,
    pub ad_cta_url: String,
    pub ad_image_url: Option<String>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct BookingWithDetails {
    pub id: Uuid,
    pub slot_date: NaiveDate,
    pub ad_headline: String,
    pub ad_body: String,
    pub ad_cta_text: Option<String>,
    pub ad_cta_url: String,
    pub ad_image_url: Option<String>,
    pub status: BookingStatus,
    pub amount_cents: i32,
    pub platform_fee_cents: i32,
    pub writer_payout_cents: i32,
    pub currency: String,
    pub created_at: DateTime<Utc>,
    pub paid_at: Option<DateTime<Utc>>,
    pub approved_at: Option<DateTime<Utc>>,
    pub published_at: Option<DateTime<Utc>>,

    pub writer_id: Uuid,
    pub newsletter_name: String,

    pub sponsor_id: Uuid,
    pub company_name: String,
    pub sponsor_logo_url: Option<String>,
}
