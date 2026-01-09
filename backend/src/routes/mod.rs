use axum::{routing::get, Router};

use crate::middlewares::RateLimitConfig;
use crate::state::AppState;

pub mod admin;
pub mod auth;
pub mod bookings;
pub mod payouts;
pub mod sponsors;
pub mod uploads;
pub mod webhooks;
pub mod widget;
pub mod writers;

async fn health_check() -> &'static str {
    "OK"
}

pub fn api_router(rate_limit_config: &RateLimitConfig) -> Router<AppState> {
    let auth_rate_limit = crate::middlewares::auth_rate_limit_layer(rate_limit_config);
    let payment_rate_limit = crate::middlewares::payment_rate_limit_layer(rate_limit_config);

    Router::new()
        .route("/health", get(health_check))
        .nest("/auth", auth::router().layer(auth_rate_limit))
        .nest("/writers", writers::router())
        .nest("/sponsors", sponsors::router())
        .nest(
            "/bookings",
            bookings::router().layer(payment_rate_limit.clone()),
        )
        .nest("/payouts", payouts::router())
        .nest("/uploads", uploads::router())
        .nest("/widget", widget::router())
        .nest("/webhooks", webhooks::router())
        .nest("/admin", admin::router())
}
