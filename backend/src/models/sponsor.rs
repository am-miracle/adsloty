use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Sponsor {
    pub id: Uuid,
    pub user_id: Uuid,

    pub company_name: String,
    pub website_url: Option<String>,
    pub logo_url: Option<String>,

    pub billing_email: Option<String>,

    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateSponsor {
    pub company_name: String,
    pub website_url: Option<String>,
    pub logo_url: Option<String>,
    pub billing_email: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSponsor {
    pub company_name: Option<String>,
    pub website_url: Option<String>,
    pub logo_url: Option<String>,
    pub billing_email: Option<String>,
}
