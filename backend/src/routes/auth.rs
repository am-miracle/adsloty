use axum::{
    extract::State,
    http::{header, HeaderMap, StatusCode},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::db;
use crate::error::{AppError, AppResult};
use crate::middlewares::Auth;
use crate::models::{
    AuthResponse, CreateUser, LoginCredentials, ResetPasswordConfirm, ResetPasswordRequest, User,
    UserRole,
};
use crate::services::email::WelcomeData;
use crate::state::AppState;
use crate::validation;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/signup", post(signup))
        .route("/login", post(login))
        .route("/logout", post(logout))
        .route("/me", get(me))
        .route("/reset-password", post(request_reset_password))
        .route("/reset-password/confirm", post(confirm_reset_password))
}

#[derive(Debug, Deserialize)]
pub struct SignupRequest {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub password: String,
    pub role: UserRole,
}

#[derive(Debug, Serialize)]
pub struct MessageResponse {
    pub message: String,
}

#[derive(Debug, Deserialize)]
pub struct LogoutRequest {
    pub token: String,
}

async fn signup(
    State(state): State<AppState>,
    Json(input): Json<SignupRequest>,
) -> AppResult<(StatusCode, Json<AuthResponse>)> {
    if !is_valid_email(&input.email) {
        return Err(AppError::Validation("Invalid email format".into()));
    }

    validation::validate_password(&input.password)?;

    let existing = db::user::get_user_by_email(&state.db, &input.email).await?;
    if existing.is_some() {
        return Err(AppError::Conflict("Email already registered".into()));
    }

    let password_hash = state.auth.hash_password(&input.password)?;

    let create_user = CreateUser {
        email: input.email.clone(),
        first_name: input.first_name.clone(),
        last_name: input.last_name.clone(),
        password: input.password,
        role: input.role,
    };

    let user = db::user::create_user(&state.db, &create_user, &password_hash).await?;

    let token = state.auth.generate_token(user.id, &user.email, user.role)?;

    if let Some(ref email_service) = state.email {
        let is_writer = matches!(user.role, UserRole::Writer);
        let welcome_data = WelcomeData {
            name: user.first_name.clone(),
            is_writer,
            dashboard_url: format!("{}/dashboard", state.config.server.frontend_url),
        };
        if let Err(e) = email_service.send_welcome(&user.email, welcome_data).await {
            tracing::error!("Failed to send welcome email: {}", e);
        }
    }

    Ok((StatusCode::CREATED, Json(AuthResponse { token, user })))
}

async fn login(
    State(state): State<AppState>,
    Json(input): Json<LoginCredentials>,
) -> AppResult<Json<AuthResponse>> {
    let user = match db::user::get_user_by_email(&state.db, &input.email).await? {
        Some(user) => user,
        None => {
            return Err(AppError::BadRequest("Email is not registered".into()));
        }
    };

    let valid = state
        .auth
        .verify_password(&input.password, &user.password_hash)?;
    if !valid {
        return Err(AppError::BadRequest("Incorrect password".into()));
    }

    db::user::update_last_login(&state.db, user.id).await?;

    let token = state.auth.generate_token(user.id, &user.email, user.role)?;

    Ok(Json(AuthResponse { token, user }))
}

async fn logout(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> AppResult<Json<MessageResponse>> {
    let auth_header = headers
        .get(header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok());

    if let Some(auth_header) = auth_header {
        if let Some(token) = auth_header.strip_prefix("Bearer ") {
            if let Ok(claims) = state.auth.verify_token(token) {
                if let Ok(user_id) = claims.sub.parse() {
                    if let Ok(expires_at) = state.auth.get_token_expiry(token) {
                        let token_hash = state.auth.hash_token(token);

                        if let Err(e) =
                            db::token::blacklist_token(&state.db, &token_hash, user_id, expires_at)
                                .await
                        {
                            tracing::error!("Failed to blacklist token: {}", e);
                        }
                    }
                }
            }
        }
    }

    Ok(Json(MessageResponse {
        message: "Logged out successfully".into(),
    }))
}

async fn me(State(state): State<AppState>, Auth(user): Auth) -> AppResult<Json<User>> {
    let user = db::user::get_user_by_id(&state.db, user.id)
        .await?
        .ok_or(AppError::NotFound("User not found".into()))?;

    Ok(Json(user))
}

async fn request_reset_password(
    State(state): State<AppState>,
    Json(input): Json<ResetPasswordRequest>,
) -> AppResult<Json<MessageResponse>> {
    let message = MessageResponse {
        message: "If an account exists with that email, a reset link has been sent".into(),
    };

    let user = db::user::get_user_by_email(&state.db, &input.email).await?;

    if let Some(_user) = user {
        let reset_token = state.auth.generate_reset_token();

        db::user::set_reset_token(&state.db, &input.email, &reset_token).await?;

        if let Some(ref email_service) = state.email {
            let reset_url = format!(
                "{}/reset-password?token={}",
                state.config.server.frontend_url, reset_token
            );

            if let Err(e) = email_service
                .send_password_reset(
                    &input.email,
                    crate::services::email::PasswordResetData { reset_url },
                )
                .await
            {
                tracing::error!("Failed to send password reset email: {}", e);
            }
        }
    }

    Ok(Json(message))
}

async fn confirm_reset_password(
    State(state): State<AppState>,
    Json(input): Json<ResetPasswordConfirm>,
) -> AppResult<Json<MessageResponse>> {
    validation::validate_password(&input.new_password)?;

    let password_hash = state.auth.hash_password(&input.new_password)?;

    let updated = db::user::reset_password(&state.db, &input.token, &password_hash).await?;

    if !updated {
        return Err(AppError::BadRequest(
            "Invalid or expired reset token".into(),
        ));
    }

    Ok(Json(MessageResponse {
        message: "Password reset successfully".into(),
    }))
}

fn is_valid_email(email: &str) -> bool {
    email.contains('@') && email.contains('.') && email.len() >= 5
}
