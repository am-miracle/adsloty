use axum::{routing::get, Router};

use crate::state::AppState;

pub mod auth;
pub mod bookings;
pub mod sponsors;
pub mod webhooks;
pub mod widget;
pub mod writers;

async fn health_check() -> &'static str {
    "OK"
}

pub fn api_router() -> Router<AppState> {
    Router::new()
        .route("/health", get(health_check))
        .nest("/auth", auth::router())
        .nest("/writers", writers::router())
        .nest("/sponsors", sponsors::router())
        .nest("/bookings", bookings::router())
        .nest("/widget", widget::router())
        .nest("/webhooks", webhooks::router())
}
