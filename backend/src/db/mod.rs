use sqlx::postgres::{PgPool, PgPoolOptions};
use std::time::Duration;

pub mod availability;
pub mod blackout;
pub mod payout;
pub mod sponsor;
pub mod token;
pub mod user;
pub mod writer;

use crate::config::DatabaseConfig;
pub type DbPool = PgPool;

pub async fn init_pool(config: &DatabaseConfig) -> Result<DbPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(config.max_connections)
        .min_connections(config.min_connections)
        .acquire_timeout(Duration::from_secs(config.acquire_timeout_secs))
        .connect(&config.url)
        .await
}

pub async fn run_migrations(pool: &DbPool) -> Result<(), sqlx::migrate::MigrateError> {
    sqlx::migrate!("./migrations").run(pool).await
}
