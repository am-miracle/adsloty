use axum::{
    extract::Request,
    http::{header, Method},
    middleware::Next,
    response::Response,
};
use tower_http::cors::{Any, CorsLayer};

use crate::config::CorsConfig;

pub mod auth;
pub mod rate_limit;

pub use auth::{Auth, SponsorAuth, WriterAuth};
pub use rate_limit::{
    auth_rate_limit_layer, general_rate_limit_layer, payment_rate_limit_layer, RateLimitConfig,
};

pub fn cors_layer(config: &CorsConfig) -> CorsLayer {
    let origins: Vec<_> = config
        .allowed_origins
        .iter()
        .filter_map(|o| o.parse().ok())
        .collect();

    let cors = CorsLayer::new()
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::PATCH,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers([
            header::AUTHORIZATION,
            header::CONTENT_TYPE,
            header::ACCEPT,
            header::ORIGIN,
        ]);

    if config.allowed_origins.iter().any(|o| o == "*") {
        cors.allow_origin(Any)
    } else {
        cors.allow_origin(origins)
            .allow_credentials(config.allow_credentials)
    }
}

pub async fn request_logging(request: Request, next: Next) -> Response {
    let method = request.method().clone();
    let uri = request.uri().clone();
    let start = std::time::Instant::now();

    let response = next.run(request).await;

    let duration = start.elapsed();
    let status = response.status();

    tracing::info!(
        method = %method,
        uri = %uri,
        status = %status.as_u16(),
        duration_ms = %duration.as_millis(),
        "request completed"
    );

    response
}
