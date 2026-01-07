use axum::{
    extract::{FromRef, FromRequestParts},
    http::{header, request::Parts, StatusCode},
    response::{IntoResponse, Response},
    Json,
};

use crate::db;
use crate::error::ErrorResponse;
use crate::services::AuthenticatedUser;
use crate::state::AppState;

pub struct Auth(pub AuthenticatedUser);

impl<S> FromRequestParts<S> for Auth
where
    AppState: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AuthError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let app_state = AppState::from_ref(state);

        let auth_header = parts
            .headers
            .get(header::AUTHORIZATION)
            .and_then(|h| h.to_str().ok())
            .ok_or(AuthError::MissingToken)?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or(AuthError::InvalidToken)?;

        let token_hash = app_state.auth.hash_token(token);
        let is_blacklisted = db::token::is_token_blacklisted(&app_state.db, &token_hash)
            .await
            .unwrap_or(false);

        if is_blacklisted {
            return Err(AuthError::TokenRevoked);
        }

        let claims = app_state
            .auth
            .verify_token(token)
            .map_err(|_| AuthError::InvalidToken)?;

        let user = AuthenticatedUser::from_claims(&claims).map_err(|_| AuthError::InvalidToken)?;

        Ok(Auth(user))
    }
}

pub struct WriterAuth(pub AuthenticatedUser);

impl<S> FromRequestParts<S> for WriterAuth
where
    AppState: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AuthError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let Auth(user) = Auth::from_request_parts(parts, state).await?;

        if !user.is_writer() && !user.is_admin() {
            return Err(AuthError::Forbidden);
        }

        Ok(WriterAuth(user))
    }
}

pub struct SponsorAuth(pub AuthenticatedUser);

impl<S> FromRequestParts<S> for SponsorAuth
where
    AppState: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AuthError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let Auth(user) = Auth::from_request_parts(parts, state).await?;

        if !user.is_sponsor() && !user.is_admin() {
            return Err(AuthError::Forbidden);
        }

        Ok(SponsorAuth(user))
    }
}

#[allow(dead_code)]
pub struct AdminAuth(pub AuthenticatedUser);

impl<S> FromRequestParts<S> for AdminAuth
where
    AppState: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = AuthError;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let Auth(user) = Auth::from_request_parts(parts, state).await?;

        if !user.is_admin() {
            return Err(AuthError::Forbidden);
        }

        Ok(AdminAuth(user))
    }
}

#[allow(dead_code)]
pub struct OptionalAuth(pub Option<AuthenticatedUser>);

impl<S> FromRequestParts<S> for OptionalAuth
where
    AppState: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = std::convert::Infallible;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        match Auth::from_request_parts(parts, state).await {
            Ok(Auth(user)) => Ok(OptionalAuth(Some(user))),
            Err(_) => Ok(OptionalAuth(None)),
        }
    }
}

#[derive(Debug)]
pub enum AuthError {
    MissingToken,
    InvalidToken,
    TokenRevoked,
    Forbidden,
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AuthError::MissingToken => (StatusCode::UNAUTHORIZED, "Missing authorization token"),
            AuthError::InvalidToken => (StatusCode::UNAUTHORIZED, "Invalid or expired token"),
            AuthError::TokenRevoked => (StatusCode::UNAUTHORIZED, "Token has been revoked"),
            AuthError::Forbidden => (StatusCode::FORBIDDEN, "Insufficient permissions"),
        };

        let body = Json(ErrorResponse {
            error: message.to_string(),
            details: None,
        });

        (status, body).into_response()
    }
}
