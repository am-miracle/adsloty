use chrono::NaiveDate;
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{BlackoutDate, CreateBlackoutDate};

pub async fn create_blackout_date(
    pool: &PgPool,
    writer_id: Uuid,
    input: &CreateBlackoutDate,
) -> Result<BlackoutDate, sqlx::Error> {
    sqlx::query_as!(
        BlackoutDate,
        r#"
        INSERT INTO blackout_dates (writer_id, blocked_date, reason)
        VALUES ($1, $2, $3)
        RETURNING *
        "#,
        writer_id,
        input.blocked_date,
        input.reason
    )
    .fetch_one(pool)
    .await
}

pub async fn delete_blackout_date(
    pool: &PgPool,
    writer_id: Uuid,
    blocked_date: NaiveDate,
) -> Result<bool, sqlx::Error> {
    let result = sqlx::query!(
        "DELETE FROM blackout_dates WHERE writer_id = $1 AND blocked_date = $2",
        writer_id,
        blocked_date
    )
    .execute(pool)
    .await?;
    Ok(result.rows_affected() > 0)
}

pub async fn get_writer_blackout_dates(
    pool: &PgPool,
    writer_id: Uuid,
) -> Result<Vec<BlackoutDate>, sqlx::Error> {
    sqlx::query_as!(
        BlackoutDate,
        "SELECT * FROM blackout_dates WHERE writer_id = $1 ORDER BY blocked_date",
        writer_id
    )
    .fetch_all(pool)
    .await
}
