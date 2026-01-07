use axum::{
    extract::{Path, State},
    routing::{get, patch, post},
    Json, Router,
};
use uuid::Uuid;

use crate::db;
use crate::error::{AppError, AppResult};
use crate::helpers::{get_sponsor_for_user_or_404, get_sponsor_or_404, require_sponsor_ownership};
use crate::middlewares::{Auth, SponsorAuth};
use crate::models::{BookingWithDetails, CreateSponsor, Sponsor, UpdateSponsor, UserRole};
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_sponsor))
        .route("/me", get(get_my_sponsor_profile))
        .route("/{id}", get(get_sponsor))
        .route("/{id}", patch(update_sponsor))
        .route("/{id}/bookings", get(list_bookings))
}

async fn create_sponsor(
    State(state): State<AppState>,
    Auth(user): Auth,
    Json(input): Json<CreateSponsor>,
) -> AppResult<Json<Sponsor>> {
    if user.role != UserRole::Sponsor && user.role != UserRole::Admin {
        return Err(AppError::Forbidden);
    }
    let existing = db::sponsor::get_sponsor_by_user_id(&state.db, user.id).await?;
    if existing.is_some() {
        return Err(AppError::Conflict("Sponsor profile already exists".into()));
    }

    if input.company_name.trim().is_empty() {
        return Err(AppError::Validation("Company name is required".into()));
    }

    let sponsor = db::sponsor::create_sponsor(&state.db, user.id, &input).await?;

    Ok(Json(sponsor))
}

async fn get_my_sponsor_profile(
    State(state): State<AppState>,
    SponsorAuth(user): SponsorAuth,
) -> AppResult<Json<Sponsor>> {
    let sponsor = get_sponsor_for_user_or_404(&state.db, user.id).await?;
    Ok(Json(sponsor))
}

async fn get_sponsor(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Sponsor>> {
    let sponsor = get_sponsor_or_404(&state.db, id).await?;
    Ok(Json(sponsor))
}

async fn update_sponsor(
    State(state): State<AppState>,
    SponsorAuth(user): SponsorAuth,
    Path(id): Path<Uuid>,
    Json(input): Json<UpdateSponsor>,
) -> AppResult<Json<Sponsor>> {
    let sponsor = get_sponsor_or_404(&state.db, id).await?;
    require_sponsor_ownership(&sponsor, user.id, user.is_admin())?;

    if let Some(ref name) = input.company_name {
        if name.trim().is_empty() {
            return Err(AppError::Validation("Company name cannot be empty".into()));
        }
    }

    let updated = db::sponsor::update_sponsor(&state.db, id, &input).await?;

    Ok(Json(updated))
}

async fn list_bookings(
    State(state): State<AppState>,
    SponsorAuth(user): SponsorAuth,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Vec<BookingWithDetails>>> {
    let sponsor = get_sponsor_or_404(&state.db, id).await?;
    require_sponsor_ownership(&sponsor, user.id, user.is_admin())?;

    let bookings = db::sponsor::get_sponsor_bookings(&state.db, id).await?;

    Ok(Json(bookings))
}
