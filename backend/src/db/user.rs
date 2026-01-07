use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{CreateUser, User, UserRole};

pub async fn create_user(
    pool: &PgPool,
    input: &CreateUser,
    password_hash: &str,
) -> Result<User, sqlx::Error> {
    sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (email, first_name, last_name, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, first_name, last_name, password_hash, role as "role: UserRole",
                  created_at, updated_at, last_login_at, reset_token, reset_token_expires
        "#,
        input.email,
        input.first_name,
        input.last_name,
        password_hash,
        input.role as UserRole
    )
    .fetch_one(pool)
    .await
}

pub async fn get_user_by_email(pool: &PgPool, email: &str) -> Result<Option<User>, sqlx::Error> {
    sqlx::query_as!(
        User,
        r#"
        SELECT id, email, first_name, last_name, password_hash, role as "role: UserRole",
               created_at, updated_at, last_login_at, reset_token, reset_token_expires
        FROM users WHERE email = $1
        "#,
        email
    )
    .fetch_optional(pool)
    .await
}

pub async fn get_user_by_id(pool: &PgPool, id: Uuid) -> Result<Option<User>, sqlx::Error> {
    sqlx::query_as!(
        User,
        r#"
        SELECT id, email, first_name, last_name, password_hash, role as "role: UserRole",
               created_at, updated_at, last_login_at, reset_token, reset_token_expires
        FROM users WHERE id = $1
        "#,
        id
    )
    .fetch_optional(pool)
    .await
}

pub async fn update_last_login(pool: &PgPool, user_id: Uuid) -> Result<(), sqlx::Error> {
    sqlx::query!(
        "UPDATE users SET last_login_at = NOW() WHERE id = $1",
        user_id
    )
    .execute(pool)
    .await?;
    Ok(())
}

pub async fn set_reset_token(pool: &PgPool, email: &str, token: &str) -> Result<bool, sqlx::Error> {
    let result = sqlx::query!(
        r#"
        UPDATE users
        SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '1 hour'
        WHERE email = $2
        "#,
        token,
        email
    )
    .execute(pool)
    .await?;
    Ok(result.rows_affected() > 0)
}

pub async fn reset_password(
    pool: &PgPool,
    token: &str,
    new_password_hash: &str,
) -> Result<bool, sqlx::Error> {
    let result = sqlx::query!(
        r#"
        UPDATE users
        SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
        WHERE reset_token = $2 AND reset_token_expires > NOW()
        "#,
        new_password_hash,
        token
    )
    .execute(pool)
    .await?;
    Ok(result.rows_affected() > 0)
}
