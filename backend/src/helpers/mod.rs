use sqlx::PgPool;
use uuid::Uuid;

use crate::db;
use crate::error::{AppError, AppResult};
use crate::models::{Booking, Sponsor, Writer};

pub async fn get_writer_or_404(pool: &PgPool, id: Uuid) -> AppResult<Writer> {
    db::writer::get_writer_by_id(pool, id)
        .await?
        .ok_or_else(|| AppError::NotFound("Writer not found".into()))
}

pub async fn get_writer_for_user_or_404(pool: &PgPool, user_id: Uuid) -> AppResult<Writer> {
    db::writer::get_writer_by_user_id(pool, user_id)
        .await?
        .ok_or_else(|| AppError::NotFound("Writer profile not found".into()))
}

pub async fn get_sponsor_or_404(pool: &PgPool, id: Uuid) -> AppResult<Sponsor> {
    db::sponsor::get_sponsor_by_id(pool, id)
        .await?
        .ok_or_else(|| AppError::NotFound("Sponsor not found".into()))
}

pub async fn get_sponsor_for_user_or_404(pool: &PgPool, user_id: Uuid) -> AppResult<Sponsor> {
    db::sponsor::get_sponsor_by_user_id(pool, user_id)
        .await?
        .ok_or_else(|| AppError::NotFound("Sponsor profile not found".into()))
}

pub async fn get_booking_or_404(pool: &PgPool, id: Uuid) -> AppResult<Booking> {
    db::sponsor::get_booking_by_id(pool, id)
        .await?
        .ok_or_else(|| AppError::NotFound("Booking not found".into()))
}

pub fn require_writer_ownership(writer: &Writer, user_id: Uuid, is_admin: bool) -> AppResult<()> {
    if writer.user_id != user_id && !is_admin {
        return Err(AppError::Forbidden);
    }
    Ok(())
}

pub fn require_sponsor_ownership(
    sponsor: &Sponsor,
    user_id: Uuid,
    is_admin: bool,
) -> AppResult<()> {
    if sponsor.user_id != user_id && !is_admin {
        return Err(AppError::Forbidden);
    }
    Ok(())
}

pub fn require_booking_ownership_by_writer(booking: &Booking, writer_id: Uuid) -> AppResult<()> {
    if booking.writer_id != writer_id {
        return Err(AppError::Forbidden);
    }
    Ok(())
}
