mod config;
mod db;
mod error;
mod helpers;
mod middlewares;
mod models;
mod responses;
mod routes;
mod services;
mod state;
mod validation;

use axum::{middleware, Router};
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

use crate::config::Config;
use crate::middlewares::RateLimitConfig;
use crate::state::AppState;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    let config = Config::from_env();

    config.init_logging();

    tracing::info!(env = ?config.env, "Starting adsloty server");

    let pool = db::init_pool(&config.database).await?;
    tracing::info!("Database connection established");

    db::run_migrations(&pool).await?;
    tracing::info!("Database migrations applied");

    let state = AppState::new(pool, config.clone());

    let rate_limit_config = RateLimitConfig::from_env();
    let general_rate_limit = middlewares::general_rate_limit_layer(&rate_limit_config);

    let app = Router::new()
        .nest("/api", routes::api_router())
        .layer(general_rate_limit)
        .layer(middleware::from_fn(middlewares::request_logging))
        .layer(TraceLayer::new_for_http())
        .layer(middlewares::cors_layer(&config.cors))
        .with_state(state);

    let addr = config.server.addr();
    let listener = TcpListener::bind(&addr).await?;

    tracing::info!(address = %addr, "Server listening");

    axum::serve(listener, app).await?;

    Ok(())
}
