use chrono::NaiveDate;
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::AvailableSlot;

pub async fn get_writer_availability(
    pool: &PgPool,
    writer_id: Uuid,
    weeks_ahead: i32,
) -> Result<Vec<AvailableSlot>, sqlx::Error> {
    sqlx::query_as!(
        AvailableSlot,
        r#"
        WITH date_range AS (
            SELECT generate_series(
                CURRENT_DATE + (SELECT lead_time_days FROM writers WHERE id = $1) * INTERVAL '1 day',
                CURRENT_DATE + $2 * INTERVAL '1 week',
                INTERVAL '1 week'
            )::DATE AS week_start
        ),
        booked_counts AS (
            SELECT slot_date, COUNT(*)::INT AS booked
            FROM bookings
            WHERE writer_id = $1
              AND status NOT IN ('rejected', 'cancelled', 'refunded')
            GROUP BY slot_date
        )
        SELECT
            d.week_start AS "available_date!",
            (w.slots_per_week - COALESCE(bc.booked, 0))::INT AS "slots_remaining!"
        FROM date_range d
        CROSS JOIN writers w
        LEFT JOIN booked_counts bc ON bc.slot_date = d.week_start
        LEFT JOIN blackout_dates bl ON bl.writer_id = $1 AND bl.blocked_date = d.week_start
        WHERE w.id = $1
          AND bl.blocked_date IS NULL
          AND (w.slots_per_week - COALESCE(bc.booked, 0)) > 0
        ORDER BY d.week_start
        "#,
        writer_id,
        weeks_ahead as f64
    )
    .fetch_all(pool)
    .await
}

pub async fn is_slot_available(
    pool: &PgPool,
    writer_id: Uuid,
    slot_date: NaiveDate,
) -> Result<bool, sqlx::Error> {
    let result = sqlx::query!(
        r#"
        SELECT
            CASE
                WHEN EXISTS (SELECT 1 FROM blackout_dates WHERE writer_id = $1 AND blocked_date = $2) THEN FALSE
                WHEN (
                    SELECT slots_per_week FROM writers WHERE id = $1
                ) > (
                    SELECT COUNT(*) FROM bookings
                    WHERE writer_id = $1 AND slot_date = $2
                    AND status NOT IN ('rejected', 'cancelled', 'refunded')
                ) THEN TRUE
                ELSE FALSE
            END AS "available!"
        "#,
        writer_id,
        slot_date
    )
    .fetch_one(pool)
    .await?;

    Ok(result.available)
}
