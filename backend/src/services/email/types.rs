#[derive(Debug)]
pub struct BookingConfirmationData {
    pub newsletter_name: String,
    pub slot_date: String,
    pub amount_cents: i32,
    pub currency: String,
    pub ad_headline: String,
    pub ad_body: String,
    pub ad_cta_text: Option<String>,
    pub ad_cta_url: String,
    pub dashboard_url: String,
}

#[derive(Debug)]
pub struct NewBookingNotificationData {
    pub sponsor_name: String,
    pub company_website: Option<String>,
    pub slot_date: String,
    pub writer_payout_cents: i32,
    pub ad_headline: String,
    pub ad_body: String,
    pub ad_cta_text: Option<String>,
    pub ad_cta_url: String,
    pub dashboard_url: String,
}

#[derive(Debug)]
pub struct BookingStatusData {
    pub newsletter_name: String,
    pub slot_date: String,
    pub dashboard_url: String,
}

#[derive(Debug)]
pub struct BookingRejectedData {
    pub newsletter_name: String,
    pub slot_date: String,
    pub amount_cents: i32,
    pub currency: String,
    pub reason: Option<String>,
}

#[derive(Debug)]
pub struct BookingPublishedData {
    pub newsletter_name: String,
    pub slot_date: String,
    pub subscriber_count: Option<i32>,
    pub ad_headline: String,
    pub ad_body: String,
    pub ad_cta_text: Option<String>,
    pub ad_cta_url: String,
    pub dashboard_url: String,
}

#[derive(Debug)]
pub struct PayoutNotificationData {
    pub amount_cents: i32,
    pub currency: String,
    pub booking_count: usize,
    pub dashboard_url: String,
}

#[derive(Debug)]
pub struct PasswordResetData {
    pub reset_url: String,
}

#[derive(Debug)]
pub struct WelcomeData {
    pub name: String,
    pub is_writer: bool,
    pub dashboard_url: String,
}
