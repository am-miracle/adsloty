use axum::body::Body;
use governor::middleware::StateInformationMiddleware;
use tower_governor::{
    governor::GovernorConfigBuilder, key_extractor::SmartIpKeyExtractor, GovernorLayer,
};

#[derive(Debug, Clone)]
pub struct RateLimitConfig {
    pub general_rps: u32,
    pub auth_rps: u32,
    pub payment_rps: u32,
    pub burst_multiplier: u32,
}

impl Default for RateLimitConfig {
    fn default() -> Self {
        Self {
            general_rps: 100,
            auth_rps: 5,
            payment_rps: 10,
            burst_multiplier: 2,
        }
    }
}

impl RateLimitConfig {
    pub fn from_env() -> Self {
        Self {
            general_rps: std::env::var("RATE_LIMIT_GENERAL_RPS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(100),
            auth_rps: std::env::var("RATE_LIMIT_AUTH_RPS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(5),
            payment_rps: std::env::var("RATE_LIMIT_PAYMENT_RPS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(10),
            burst_multiplier: std::env::var("RATE_LIMIT_BURST_MULTIPLIER")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(2),
        }
    }
}

pub fn general_rate_limit_layer(
    config: &RateLimitConfig,
) -> GovernorLayer<SmartIpKeyExtractor, StateInformationMiddleware, Body> {
    let governor_conf = GovernorConfigBuilder::default()
        .per_second(config.general_rps as u64)
        .burst_size(config.general_rps * config.burst_multiplier)
        .use_headers()
        .key_extractor(SmartIpKeyExtractor)
        .finish()
        .expect("Failed to build rate limiter config");

    GovernorLayer::new(governor_conf)
}

pub fn auth_rate_limit_layer(
    config: &RateLimitConfig,
) -> GovernorLayer<SmartIpKeyExtractor, StateInformationMiddleware, Body> {
    let governor_conf = GovernorConfigBuilder::default()
        .per_second(config.auth_rps as u64)
        .burst_size(config.auth_rps * config.burst_multiplier)
        .use_headers()
        .key_extractor(SmartIpKeyExtractor)
        .finish()
        .expect("Failed to build auth rate limiter config");

    GovernorLayer::new(governor_conf)
}

pub fn payment_rate_limit_layer(
    config: &RateLimitConfig,
) -> GovernorLayer<SmartIpKeyExtractor, StateInformationMiddleware, Body> {
    let governor_conf = GovernorConfigBuilder::default()
        .per_second(config.payment_rps as u64)
        .burst_size(config.payment_rps * config.burst_multiplier)
        .use_headers()
        .key_extractor(SmartIpKeyExtractor)
        .finish()
        .expect("Failed to build payment rate limiter config");

    GovernorLayer::new(governor_conf)
}
