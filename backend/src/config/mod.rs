use std::env;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Environment {
    Development,
    Production,
}

impl Environment {
    pub fn from_str(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "production" | "prod" => Self::Production,
            _ => Self::Development,
        }
    }

    pub fn is_dev(&self) -> bool {
        matches!(self, Self::Development)
    }
}

#[derive(Debug, Clone)]
pub struct DatabaseConfig {
    pub url: String,
    pub max_connections: u32,
    pub min_connections: u32,
    pub acquire_timeout_secs: u64,
}

impl DatabaseConfig {
    pub fn from_env(env: Environment) -> Self {
        let url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

        let (max_conn, min_conn) = match env {
            Environment::Development => (5, 1),
            Environment::Production => (20, 5),
        };

        Self {
            url,
            max_connections: env::var("DB_MAX_CONNECTIONS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(max_conn),
            min_connections: env::var("DB_MIN_CONNECTIONS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(min_conn),
            acquire_timeout_secs: env::var("DB_ACQUIRE_TIMEOUT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(3),
        }
    }
}

#[derive(Debug, Clone)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub frontend_url: String,
}

impl ServerConfig {
    pub fn from_env() -> Self {
        Self {
            host: env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
            port: env::var("PORT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(3000),
            frontend_url: env::var("FRONTEND_URL")
                .unwrap_or_else(|_| "http://localhost:5173".to_string()),
        }
    }

    pub fn addr(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }
}

#[derive(Debug, Clone)]
pub struct CorsConfig {
    pub allowed_origins: Vec<String>,
    pub allow_credentials: bool,
}

impl CorsConfig {
    pub fn from_env(env: Environment) -> Self {
        let origins = match env {
            Environment::Development => {
                vec![
                    "http://localhost:3000".to_string(),
                    "http://localhost:5173".to_string(),
                    "http://127.0.0.1:3000".to_string(),
                    "http://127.0.0.1:5173".to_string(),
                ]
            }
            Environment::Production => env::var("CORS_ORIGINS")
                .map(|s| s.split(',').map(|s| s.trim().to_string()).collect())
                .unwrap_or_else(|_| vec!["https://adsloty.com".to_string()]),
        };

        Self {
            allowed_origins: origins,
            allow_credentials: true,
        }
    }
}

#[derive(Debug, Clone)]
pub struct JwtConfig {
    pub secret: String,
    pub expiry_hours: i64,
}

impl JwtConfig {
    pub fn from_env(env: Environment) -> Self {
        let secret = env::var("JWT_SECRET").unwrap_or_else(|_| {
            if env.is_dev() {
                eprintln!(
                    "WARNING: JWT_SECRET not set. Using insecure development secret. \
                     Do NOT use this in production!"
                );
                "dev-secret-change-in-production".to_string()
            } else {
                panic!("JWT_SECRET must be set in production")
            }
        });

        Self {
            secret,
            expiry_hours: env::var("JWT_EXPIRY_HOURS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(24 * 7),
        }
    }
}

/// Application configuration (combines all configs)
#[derive(Debug, Clone)]
pub struct Config {
    pub env: Environment,
    pub database: DatabaseConfig,
    pub server: ServerConfig,
    pub cors: CorsConfig,
    pub jwt: JwtConfig,
}

impl Config {
    pub fn from_env() -> Self {
        let env = Environment::from_str(
            &env::var("APP_ENV").unwrap_or_else(|_| "development".to_string()),
        );

        Self {
            env,
            database: DatabaseConfig::from_env(env),
            server: ServerConfig::from_env(),
            cors: CorsConfig::from_env(env),
            jwt: JwtConfig::from_env(env),
        }
    }

    pub fn init_logging(&self) {
        use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

        let filter = match self.env {
            Environment::Development => EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("adsloty=debug,tower_http=debug,sqlx=warn")),
            Environment::Production => EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("adsloty=info,tower_http=info,sqlx=warn")),
        };

        tracing_subscriber::registry()
            .with(filter)
            .with(tracing_subscriber::fmt::layer())
            .init();
    }
}
