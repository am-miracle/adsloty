use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "user_role", rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum UserRole {
    Writer,
    Sponsor,
    Admin,
}

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub role: UserRole,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_login_at: Option<DateTime<Utc>>,
    #[serde(skip_serializing)]
    #[allow(dead_code)] // Populated by SQLx, verified via DB query
    pub reset_token: Option<String>,
    #[serde(skip_serializing)]
    #[allow(dead_code)] // Populated by SQLx, verified via DB query
    pub reset_token_expires: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUser {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    #[allow(dead_code)] // Stored for struct completeness, hashed separately before DB insert
    pub password: String,
    pub role: UserRole,
}

#[derive(Debug, Deserialize)]
pub struct LoginCredentials {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}

#[derive(Debug, Deserialize)]
pub struct ResetPasswordRequest {
    pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct ResetPasswordConfirm {
    pub token: String,
    pub new_password: String,
}
