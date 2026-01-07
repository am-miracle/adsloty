use crate::error::{AppError, AppResult};
use lettre::{
    message::{header::ContentType, Mailbox},
    transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
};

use super::templates::EmailTemplate;
use super::types::*;

#[derive(Debug, Clone)]
pub struct EmailConfig {
    pub smtp_host: String,
    pub smtp_port: u16,
    pub smtp_username: String,
    pub smtp_password: String,
    pub from_email: String,
    pub from_name: String,
}

impl EmailConfig {
    pub fn from_env() -> Option<Self> {
        Some(Self {
            smtp_host: std::env::var("SMTP_HOST").ok()?,
            smtp_port: std::env::var("SMTP_PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(587),
            smtp_username: std::env::var("SMTP_USERNAME").ok()?,
            smtp_password: std::env::var("SMTP_PASSWORD").ok()?,
            from_email: std::env::var("FROM_EMAIL").ok()?,
            from_name: std::env::var("FROM_NAME").unwrap_or_else(|_| "Adsloty".to_string()),
        })
    }
}

#[derive(Clone)]
pub struct EmailService {
    transport: AsyncSmtpTransport<Tokio1Executor>,
    from: Mailbox,
}

impl EmailService {
    pub fn new(config: &EmailConfig) -> AppResult<Self> {
        let creds = Credentials::new(config.smtp_username.clone(), config.smtp_password.clone());

        let transport = AsyncSmtpTransport::<Tokio1Executor>::relay(&config.smtp_host)
            .map_err(|e| AppError::Internal(format!("SMTP setup failed: {}", e)))?
            .port(config.smtp_port)
            .credentials(creds)
            .build();

        let from = format!("{} <{}>", config.from_name, config.from_email)
            .parse()
            .map_err(|e| AppError::Internal(format!("Invalid from address: {}", e)))?;

        Ok(Self { transport, from })
    }

    async fn send(&self, to: &str, subject: &str, html_body: &str) -> AppResult<()> {
        let to_mailbox: Mailbox = to
            .parse()
            .map_err(|_| AppError::BadRequest("Invalid email address".into()))?;

        let email = Message::builder()
            .from(self.from.clone())
            .to(to_mailbox)
            .subject(subject)
            .header(ContentType::TEXT_HTML)
            .body(html_body.to_string())
            .map_err(|e| AppError::Internal(format!("Failed to build email: {}", e)))?;

        self.transport
            .send(email)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to send email: {}", e)))?;

        Ok(())
    }

    pub async fn send_booking_confirmation(
        &self,
        sponsor_email: &str,
        data: BookingConfirmationData,
    ) -> AppResult<()> {
        let subject = format!("Booking Confirmed - {}", data.newsletter_name);
        let html = EmailTemplate::booking_confirmation(&data);
        self.send(sponsor_email, &subject, &html).await
    }

    pub async fn send_new_booking_notification(
        &self,
        writer_email: &str,
        data: NewBookingNotificationData,
    ) -> AppResult<()> {
        let subject = format!("New Booking from {}", data.sponsor_name);
        let html = EmailTemplate::new_booking_notification(&data);
        self.send(writer_email, &subject, &html).await
    }

    pub async fn send_booking_approved(
        &self,
        sponsor_email: &str,
        data: BookingStatusData,
    ) -> AppResult<()> {
        let subject = format!("Your Ad is Approved - {}", data.newsletter_name);
        let html = EmailTemplate::booking_approved(&data);
        self.send(sponsor_email, &subject, &html).await
    }

    pub async fn send_booking_rejected(
        &self,
        sponsor_email: &str,
        data: BookingRejectedData,
    ) -> AppResult<()> {
        let subject = format!("Booking Update - {}", data.newsletter_name);
        let html = EmailTemplate::booking_rejected(&data);
        self.send(sponsor_email, &subject, &html).await
    }

    pub async fn send_booking_published(
        &self,
        sponsor_email: &str,
        data: BookingPublishedData,
    ) -> AppResult<()> {
        let subject = format!("Your Ad is Live! - {}", data.newsletter_name);
        let html = EmailTemplate::booking_published(&data);
        self.send(sponsor_email, &subject, &html).await
    }

    pub async fn send_payout_notification(
        &self,
        writer_email: &str,
        data: PayoutNotificationData,
    ) -> AppResult<()> {
        let subject = format!(
            "Payout Initiated - ${:.2}",
            data.amount_cents as f64 / 100.0
        );
        let html = EmailTemplate::payout_notification(&data);
        self.send(writer_email, &subject, &html).await
    }

    pub async fn send_password_reset(&self, email: &str, data: PasswordResetData) -> AppResult<()> {
        let subject = "Reset Your Password - Adsloty";
        let html = EmailTemplate::password_reset(&data);
        self.send(email, subject, &html).await
    }

    pub async fn send_welcome(&self, email: &str, data: WelcomeData) -> AppResult<()> {
        let subject = "Welcome to Adsloty!";
        let html = EmailTemplate::welcome(&data);
        self.send(email, subject, &html).await
    }
}
