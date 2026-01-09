use hmac::{Hmac, Mac};
use reqwest::Client;
use serde::Deserialize;
use sha2::Sha256;
use std::collections::HashMap;

use crate::error::{AppError, AppResult};

type HmacSha256 = Hmac<Sha256>;

const API_BASE_URL: &str = "https://api.lemonsqueezy.com/v1";

#[derive(Debug, Clone)]
pub struct LemonSqueezyConfig {
    pub api_key: String,
    pub store_id: String,
    pub webhook_secret: String,
    pub ad_slot_variant_id: String,
}

impl LemonSqueezyConfig {
    pub fn from_env() -> Self {
        Self {
            api_key: std::env::var("LEMONSQUEEZY_API_KEY")
                .expect("LEMONSQUEEZY_API_KEY must be set"),
            store_id: std::env::var("LEMONSQUEEZY_STORE_ID")
                .expect("LEMONSQUEEZY_STORE_ID must be set"),
            webhook_secret: std::env::var("LEMONSQUEEZY_WEBHOOK_SECRET")
                .expect("LEMONSQUEEZY_WEBHOOK_SECRET must be set"),
            ad_slot_variant_id: std::env::var("LEMONSQUEEZY_VARIANT_ID")
                .expect("LEMONSQUEEZY_VARIANT_ID must be set"),
        }
    }
}

#[derive(Clone)]
pub struct LemonSqueezyService {
    client: Client,
    config: LemonSqueezyConfig,
}

impl LemonSqueezyService {
    pub fn new(config: LemonSqueezyConfig) -> Self {
        Self {
            client: Client::new(),
            config,
        }
    }

    fn auth_headers(&self) -> reqwest::header::HeaderMap {
        let mut headers = reqwest::header::HeaderMap::new();
        headers.insert(
            reqwest::header::AUTHORIZATION,
            format!("Bearer {}", self.config.api_key).parse().unwrap(),
        );
        headers.insert(
            reqwest::header::ACCEPT,
            "application/vnd.api+json".parse().unwrap(),
        );
        headers.insert(
            reqwest::header::CONTENT_TYPE,
            "application/vnd.api+json".parse().unwrap(),
        );
        headers
    }

    pub async fn create_checkout(&self, params: CreateCheckoutParams) -> AppResult<CheckoutResult> {
        let custom_data: HashMap<String, String> = [
            ("booking_id".to_string(), params.booking_id.clone()),
            ("writer_id".to_string(), params.writer_id.clone()),
            ("sponsor_id".to_string(), params.sponsor_id.clone()),
        ]
        .into();

        let request_body = serde_json::json!({
            "data": {
                "type": "checkouts",
                "attributes": {
                    "custom_price": params.amount_cents,
                    "product_options": {
                        "name": format!("Ad Slot: {}", params.newsletter_name),
                        "description": format!("Ad placement in {} for {}", params.newsletter_name, params.slot_date),
                        "redirect_url": params.success_url,
                    },
                    "checkout_options": {
                        "button_color": "#7C3AED"
                    },
                    "checkout_data": {
                        "email": params.sponsor_email,
                        "custom": custom_data,
                    },
                    "expires_at": params.expires_at,
                },
                "relationships": {
                    "store": {
                        "data": {
                            "type": "stores",
                            "id": self.config.store_id
                        }
                    },
                    "variant": {
                        "data": {
                            "type": "variants",
                            "id": self.config.ad_slot_variant_id
                        }
                    }
                }
            }
        });

        let response = self
            .client
            .post(format!("{}/checkouts", API_BASE_URL))
            .headers(self.auth_headers())
            .json(&request_body)
            .send()
            .await
            .map_err(|e| AppError::Internal(format!("Lemon Squeezy request failed: {}", e)))?;

        if !response.status().is_success() {
            let error_text = response.text().await.unwrap_or_default();
            return Err(AppError::Internal(format!(
                "Lemon Squeezy checkout creation failed: {}",
                error_text
            )));
        }

        let checkout_response: CheckoutResponse = response
            .json()
            .await
            .map_err(|e| AppError::Internal(format!("Failed to parse checkout response: {}", e)))?;

        Ok(CheckoutResult {
            checkout_id: checkout_response.data.id,
            checkout_url: checkout_response.data.attributes.url,
        })
    }

    pub async fn get_checkout(&self, checkout_id: &str) -> AppResult<CheckoutData> {
        let response = self
            .client
            .get(format!("{}/checkouts/{}", API_BASE_URL, checkout_id))
            .headers(self.auth_headers())
            .send()
            .await
            .map_err(|e| AppError::Internal(format!("Lemon Squeezy request failed: {}", e)))?;

        if !response.status().is_success() {
            return Err(AppError::NotFound("Checkout not found".into()));
        }

        let checkout_response: CheckoutResponse = response
            .json()
            .await
            .map_err(|e| AppError::Internal(format!("Failed to parse response: {}", e)))?;

        Ok(checkout_response.data)
    }

    pub async fn get_order(&self, order_id: &str) -> AppResult<OrderData> {
        let response = self
            .client
            .get(format!("{}/orders/{}", API_BASE_URL, order_id))
            .headers(self.auth_headers())
            .send()
            .await
            .map_err(|e| AppError::Internal(format!("Lemon Squeezy request failed: {}", e)))?;

        if !response.status().is_success() {
            return Err(AppError::NotFound("Order not found".into()));
        }

        let order_response: OrderResponse = response
            .json()
            .await
            .map_err(|e| AppError::Internal(format!("Failed to parse response: {}", e)))?;

        Ok(order_response.data)
    }

    pub async fn refund_order(&self, order_id: &str) -> AppResult<()> {
        let request_body = serde_json::json!({
            "data": {
                "type": "orders",
                "id": order_id,
                "attributes": {
                    "refund": true
                }
            }
        });

        let response = self
            .client
            .patch(format!("{}/orders/{}", API_BASE_URL, order_id))
            .headers(self.auth_headers())
            .json(&request_body)
            .send()
            .await
            .map_err(|e| AppError::Internal(format!("Lemon Squeezy request failed: {}", e)))?;

        if !response.status().is_success() {
            let error_text = response.text().await.unwrap_or_default();
            return Err(AppError::Internal(format!("Refund failed: {}", error_text)));
        }

        Ok(())
    }

    pub fn verify_webhook(&self, payload: &[u8], signature: &str) -> AppResult<()> {
        let mut mac = HmacSha256::new_from_slice(self.config.webhook_secret.as_bytes())
            .map_err(|_| AppError::Internal("Invalid webhook secret".into()))?;

        mac.update(payload);

        let expected = hex::encode(mac.finalize().into_bytes());

        if expected != signature {
            return Err(AppError::BadRequest("Invalid webhook signature".into()));
        }

        Ok(())
    }

    pub fn parse_webhook_event(&self, payload: &str) -> AppResult<WebhookEvent> {
        serde_json::from_str(payload)
            .map_err(|e| AppError::BadRequest(format!("Invalid webhook payload: {}", e)))
    }
}

#[derive(Debug)]
pub struct CreateCheckoutParams {
    pub booking_id: String,
    pub writer_id: String,
    pub sponsor_id: String,
    pub sponsor_email: String,
    pub newsletter_name: String,
    pub slot_date: String,
    pub amount_cents: i64,
    pub success_url: String,
    pub expires_at: Option<String>,
}

#[derive(Debug)]
pub struct CheckoutResult {
    pub checkout_id: String,
    pub checkout_url: String,
}

#[derive(Debug, Deserialize)]
pub struct CheckoutResponse {
    pub data: CheckoutData,
}

#[derive(Debug, Deserialize)]
pub struct CheckoutData {
    pub id: String,
    #[serde(rename = "type")]
    pub data_type: String,
    pub attributes: CheckoutAttributes,
}

#[derive(Debug, Deserialize)]
pub struct CheckoutAttributes {
    pub url: String,
    pub expires_at: Option<String>,
    pub test_mode: bool,
}

#[derive(Debug, Deserialize)]
pub struct OrderResponse {
    pub data: OrderData,
}

#[derive(Debug, Deserialize)]
pub struct OrderData {
    pub id: String,
    #[serde(rename = "type")]
    pub data_type: String,
    pub attributes: OrderAttributes,
}

#[derive(Debug, Deserialize, serde::Serialize)]
pub struct OrderAttributes {
    pub store_id: i64,
    pub customer_id: i64,
    pub identifier: String,
    pub order_number: i64,
    pub user_name: String,
    pub user_email: String,
    pub currency: String,
    pub currency_rate: String,
    pub subtotal: i64,
    pub discount_total: i64,
    pub tax: i64,
    pub total: i64,
    pub subtotal_usd: i64,
    pub discount_total_usd: i64,
    pub tax_usd: i64,
    pub total_usd: i64,
    pub status: String,
    pub status_formatted: String,
    pub refunded: bool,
    pub refunded_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct WebhookEvent {
    pub meta: WebhookMeta,
    pub data: WebhookData,
}

#[derive(Debug, Deserialize)]
pub struct WebhookMeta {
    pub event_name: String,
    pub custom_data: Option<HashMap<String, String>>,
}

#[derive(Debug, Deserialize)]
pub struct WebhookData {
    pub id: String,
    #[serde(rename = "type")]
    pub data_type: String,
    pub attributes: serde_json::Value,
}

impl WebhookEvent {
    pub fn get_custom_data(&self, key: &str) -> Option<&String> {
        self.meta.custom_data.as_ref()?.get(key)
    }

    pub fn is_order_created(&self) -> bool {
        self.meta.event_name == "order_created"
    }

    pub fn is_order_refunded(&self) -> bool {
        self.meta.event_name == "order_refunded"
    }

    pub fn get_order_attributes(&self) -> Option<OrderAttributes> {
        if self.data.data_type == "orders" {
            serde_json::from_value(self.data.attributes.clone()).ok()
        } else {
            None
        }
    }
}
