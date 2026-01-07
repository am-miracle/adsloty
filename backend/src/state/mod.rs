use std::sync::Arc;

use crate::config::Config;
use crate::db::DbPool;
use crate::services::{
    AuthService, CloudinaryConfig, CloudinaryService, EmailConfig, EmailService,
    LemonSqueezyConfig, LemonSqueezyService,
};

#[derive(Clone)]
pub struct AppState {
    pub db: DbPool,
    pub config: Arc<Config>,
    pub auth: AuthService,
    pub payments: Option<LemonSqueezyService>,
    pub storage: Option<CloudinaryService>,
    pub email: Option<EmailService>,
}

impl AppState {
    pub fn new(db: DbPool, config: Config) -> Self {
        let auth = AuthService::new(&config.jwt);

        let payments = if std::env::var("LEMONSQUEEZY_API_KEY").is_ok() {
            Some(LemonSqueezyService::new(LemonSqueezyConfig::from_env()))
        } else {
            tracing::warn!("Lemon Squeezy not configured - payments disabled");
            None
        };

        let storage = CloudinaryConfig::from_env().map(CloudinaryService::new);
        if storage.is_none() {
            tracing::warn!("Cloudinary not configured - image uploads disabled");
        }

        let email = EmailConfig::from_env().and_then(|c| EmailService::new(&c).ok());
        if email.is_none() {
            tracing::warn!("Email not configured - notifications disabled");
        }

        Self {
            db,
            config: Arc::new(config),
            auth,
            payments,
            storage,
            email,
        }
    }

    pub fn require_payments(&self) -> Result<&LemonSqueezyService, crate::error::AppError> {
        self.payments
            .as_ref()
            .ok_or_else(|| crate::error::AppError::Internal("Payments not configured".into()))
    }

    pub fn require_storage(&self) -> Result<&CloudinaryService, crate::error::AppError> {
        self.storage
            .as_ref()
            .ok_or_else(|| crate::error::AppError::Internal("Storage not configured".into()))
    }

    pub fn require_email(&self) -> Result<&EmailService, crate::error::AppError> {
        self.email
            .as_ref()
            .ok_or_else(|| crate::error::AppError::Internal("Email not configured".into()))
    }
}
