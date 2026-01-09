mod service;
mod templates;
mod types;

pub use service::{EmailConfig, EmailService};
pub use types::{
    BookingConfirmationData, BookingPublishedData, BookingRejectedData, BookingStatusData,
    NewBookingNotificationData, PasswordResetData, PayoutNotificationData, WelcomeData,
};
