use chrono::{DateTime, Utc};
use sqlx::PgPool;
use uuid::Uuid;

pub async fn blacklist_token(
    pool: &PgPool,
    token_hash: &str,
    user_id: Uuid,
    expires_at: DateTime<Utc>,
) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        INSERT INTO token_blacklist (token_hash, user_id, expires_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (token_hash) DO NOTHING
        "#,
        token_hash,
        user_id,
        expires_at
    )
    .execute(pool)
    .await?;
    Ok(())
}

pub async fn is_token_blacklisted(pool: &PgPool, token_hash: &str) -> Result<bool, sqlx::Error> {
    let result = sqlx::query!(
        r#"
        SELECT EXISTS(
            SELECT 1 FROM token_blacklist
            WHERE token_hash = $1 AND expires_at > NOW()
        ) AS "exists!"
        "#,
        token_hash
    )
    .fetch_one(pool)
    .await?;

    Ok(result.exists)
}

pub async fn blacklist_all_user_tokens(
    pool: &PgPool,
    user_id: Uuid,
    _expires_at: DateTime<Utc>,
) -> Result<(), sqlx::Error> {
    // We can't blacklist tokens we don't know about, but we can
    // update a "tokens_invalid_before" timestamp on the user
    // For now, this is a placeholder for future implementation
    sqlx::query!("UPDATE users SET updated_at = NOW() WHERE id = $1", user_id)
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn cleanup_expired_tokens(pool: &PgPool) -> Result<i64, sqlx::Error> {
    let result = sqlx::query!("SELECT cleanup_expired_tokens() AS count")
        .fetch_one(pool)
        .await?;

    Ok(result.count.unwrap_or(0) as i64)
}
