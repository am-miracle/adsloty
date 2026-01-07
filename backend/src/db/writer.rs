use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{CreateWriter, UpdateWriter, Writer, WriterStats};

pub async fn create_writer(
    pool: &PgPool,
    user_id: Uuid,
    input: &CreateWriter,
) -> Result<Writer, sqlx::Error> {
    sqlx::query_as!(
        Writer,
        r#"
        INSERT INTO writers (user_id, newsletter_name, newsletter_url, description,
                            subscriber_count, price_per_slot, currency, lead_time_days, slots_per_week)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        "#,
        user_id,
        input.newsletter_name,
        input.newsletter_url,
        input.description,
        input.subscriber_count,
        input.price_per_slot,
        input.currency,
        input.lead_time_days,
        input.slots_per_week
    )
    .fetch_one(pool)
    .await
}

pub async fn get_writer_by_id(pool: &PgPool, id: Uuid) -> Result<Option<Writer>, sqlx::Error> {
    sqlx::query_as!(Writer, "SELECT * FROM writers WHERE id = $1", id)
        .fetch_optional(pool)
        .await
}

pub async fn get_writer_by_user_id(
    pool: &PgPool,
    user_id: Uuid,
) -> Result<Option<Writer>, sqlx::Error> {
    sqlx::query_as!(Writer, "SELECT * FROM writers WHERE user_id = $1", user_id)
        .fetch_optional(pool)
        .await
}

pub async fn update_writer(
    pool: &PgPool,
    writer_id: Uuid,
    input: &UpdateWriter,
) -> Result<Writer, sqlx::Error> {
    sqlx::query_as!(
        Writer,
        r#"
        UPDATE writers
        SET newsletter_name = COALESCE($1, newsletter_name),
            newsletter_url = COALESCE($2, newsletter_url),
            description = COALESCE($3, description),
            subscriber_count = COALESCE($4, subscriber_count),
            price_per_slot = COALESCE($5, price_per_slot),
            lead_time_days = COALESCE($6, lead_time_days),
            slots_per_week = COALESCE($7, slots_per_week),
            auto_approve = COALESCE($8, auto_approve),
            updated_at = NOW()
        WHERE id = $9
        RETURNING *
        "#,
        input.newsletter_name,
        input.newsletter_url,
        input.description,
        input.subscriber_count,
        input.price_per_slot,
        input.lead_time_days,
        input.slots_per_week,
        input.auto_approve,
        writer_id
    )
    .fetch_one(pool)
    .await
}

pub async fn get_writer_stats(pool: &PgPool, writer_id: Uuid) -> Result<WriterStats, sqlx::Error> {
    sqlx::query_as!(
        WriterStats,
        r#"
        SELECT
            COUNT(*) FILTER (WHERE status = 'published') as "total_published!",
            COUNT(*) FILTER (WHERE status IN ('paid', 'approved')) as "pending_bookings!",
            COALESCE(SUM(writer_payout_cents) FILTER (WHERE status = 'published'), 0) as "total_revenue_cents!",
            COALESCE(SUM(writer_payout_cents) FILTER (WHERE status IN ('paid', 'approved')), 0) as "pending_revenue_cents!"
        FROM bookings
        WHERE writer_id = $1
        "#,
        writer_id
    )
    .fetch_one(pool)
    .await
}
