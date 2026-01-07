use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub details: Option<String>,
}

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Bad request: {0}")]
    BadRequest(String),

    #[error("Unauthorized")]
    Unauthorized,

    #[error("Forbidden")]
    Forbidden,

    #[error("Conflict: {0}")]
    Conflict(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Database error")]
    Database(#[from] sqlx::Error),

    #[error("JWT error")]
    Jwt(#[from] jsonwebtoken::errors::Error),

    #[error("Internal server error")]
    Internal(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message, details) = match &self {
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, "Not found", Some(msg.clone())),
            AppError::BadRequest(msg) => {
                (StatusCode::BAD_REQUEST, "Bad request", Some(msg.clone()))
            }
            AppError::Unauthorized => (StatusCode::UNAUTHORIZED, "Unauthorized", None),
            AppError::Forbidden => (StatusCode::FORBIDDEN, "Forbidden", None),
            AppError::Conflict(msg) => (StatusCode::CONFLICT, "Conflict", Some(msg.clone())),
            AppError::Validation(msg) => (
                StatusCode::UNPROCESSABLE_ENTITY,
                "Validation error",
                Some(msg.clone()),
            ),
            AppError::Database(e) => {
                tracing::error!("Database error: {:?}", e);
                (StatusCode::INTERNAL_SERVER_ERROR, "Database error", None)
            }
            AppError::Jwt(_) => (StatusCode::UNAUTHORIZED, "Invalid token", None),

            AppError::Internal(msg) => {
                tracing::error!("Internal error: {}", msg);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Internal server error",
                    None,
                )
            }
        };

        let body = Json(ErrorResponse {
            error: error_message.to_string(),
            details,
        });

        (status, body).into_response()
    }
}

pub type AppResult<T> = Result<T, AppError>;
