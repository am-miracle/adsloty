use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use chrono::{DateTime, Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::config::JwtConfig;
use crate::error::{AppError, AppResult};
use crate::models::UserRole;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub email: String,
    pub role: String,
    pub exp: i64,
    pub iat: i64,
}

#[derive(Clone)]
pub struct AuthService {
    jwt_secret: String,
    jwt_expiry_hours: i64,
}

impl AuthService {
    pub fn new(config: &JwtConfig) -> Self {
        Self {
            jwt_secret: config.secret.clone(),
            jwt_expiry_hours: config.expiry_hours,
        }
    }

    pub fn hash_password(&self, password: &str) -> AppResult<String> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();

        argon2
            .hash_password(password.as_bytes(), &salt)
            .map(|hash| hash.to_string())
            .map_err(|e| AppError::Internal(format!("Password hashing failed: {}", e)))
    }

    pub fn verify_password(&self, password: &str, hash: &str) -> AppResult<bool> {
        let parsed_hash = PasswordHash::new(hash)
            .map_err(|e| AppError::Internal(format!("Invalid password hash: {}", e)))?;

        Ok(Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok())
    }

    pub fn generate_token(&self, user_id: Uuid, email: &str, role: UserRole) -> AppResult<String> {
        let now = Utc::now();
        let exp = now + Duration::hours(self.jwt_expiry_hours);

        let claims = Claims {
            sub: user_id.to_string(),
            email: email.to_string(),
            role: format!("{:?}", role).to_lowercase(),
            exp: exp.timestamp(),
            iat: now.timestamp(),
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_bytes()),
        )
        .map_err(|e| AppError::Internal(format!("Token generation failed: {}", e)))
    }

    pub fn verify_token(&self, token: &str) -> AppResult<Claims> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|e| match e.kind() {
            jsonwebtoken::errors::ErrorKind::ExpiredSignature => AppError::Unauthorized,
            jsonwebtoken::errors::ErrorKind::InvalidToken => AppError::Unauthorized,
            _ => AppError::Unauthorized,
        })?;

        Ok(token_data.claims)
    }

    pub fn get_user_id(&self, claims: &Claims) -> AppResult<Uuid> {
        claims
            .sub
            .parse()
            .map_err(|_| AppError::Internal("Invalid user ID in token".into()))
    }

    pub fn get_user_role(&self, claims: &Claims) -> AppResult<UserRole> {
        match claims.role.as_str() {
            "writer" => Ok(UserRole::Writer),
            "sponsor" => Ok(UserRole::Sponsor),
            "admin" => Ok(UserRole::Admin),
            _ => Err(AppError::Internal("Invalid role in token".into())),
        }
    }

    pub fn generate_reset_token(&self) -> String {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        let token: String = (0..32)
            .map(|_| {
                let idx = rng.gen_range(0..36);
                if idx < 10 {
                    (b'0' + idx) as char
                } else {
                    (b'a' + idx - 10) as char
                }
            })
            .collect();
        token
    }

    pub fn hash_token(&self, token: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(token.as_bytes());
        hex::encode(hasher.finalize())
    }

    pub fn get_token_expiry(&self, token: &str) -> AppResult<DateTime<Utc>> {
        let claims = self.verify_token(token)?;
        Ok(DateTime::from_timestamp(claims.exp, 0)
            .unwrap_or_else(|| Utc::now() + Duration::hours(self.jwt_expiry_hours)))
    }
}

#[derive(Debug, Clone)]
pub struct AuthenticatedUser {
    pub id: Uuid,
    pub email: String,
    pub role: UserRole,
}

impl AuthenticatedUser {
    pub fn from_claims(claims: &Claims) -> AppResult<Self> {
        let id = claims
            .sub
            .parse()
            .map_err(|_| AppError::Internal("Invalid user ID".into()))?;

        let role = match claims.role.as_str() {
            "writer" => UserRole::Writer,
            "sponsor" => UserRole::Sponsor,
            "admin" => UserRole::Admin,
            _ => return Err(AppError::Internal("Invalid role".into())),
        };

        Ok(Self {
            id,
            email: claims.email.clone(),
            role,
        })
    }

    pub fn is_writer(&self) -> bool {
        matches!(self.role, UserRole::Writer)
    }

    pub fn is_sponsor(&self) -> bool {
        matches!(self.role, UserRole::Sponsor)
    }

    pub fn is_admin(&self) -> bool {
        matches!(self.role, UserRole::Admin)
    }
}
