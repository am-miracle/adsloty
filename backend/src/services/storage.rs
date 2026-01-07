use reqwest::multipart::{Form, Part};
use reqwest::Client;
use serde::Deserialize;
use sha1::{Digest, Sha1};

use crate::error::{AppError, AppResult};

#[derive(Debug, Clone)]
pub struct CloudinaryConfig {
    pub cloud_name: String,
    pub api_key: String,
    pub api_secret: String,
    pub folder: Option<String>,
}

impl CloudinaryConfig {
    pub fn from_env() -> Option<Self> {
        Some(Self {
            cloud_name: std::env::var("CLOUDINARY_CLOUD_NAME").ok()?,
            api_key: std::env::var("CLOUDINARY_API_KEY").ok()?,
            api_secret: std::env::var("CLOUDINARY_API_SECRET").ok()?,
            folder: std::env::var("CLOUDINARY_FOLDER").ok(),
        })
    }

    pub fn upload_url(&self) -> String {
        format!(
            "https://api.cloudinary.com/v1_1/{}/image/upload",
            self.cloud_name
        )
    }

    pub fn delete_url(&self) -> String {
        format!(
            "https://api.cloudinary.com/v1_1/{}/image/destroy",
            self.cloud_name
        )
    }
}

#[derive(Clone)]
pub struct CloudinaryService {
    client: Client,
    config: CloudinaryConfig,
}

impl CloudinaryService {
    pub fn new(config: CloudinaryConfig) -> Self {
        Self {
            client: Client::new(),
            config,
        }
    }

    fn generate_signature(&self, params: &[(&str, &str)]) -> String {
        let mut sorted_params: Vec<_> = params.to_vec();
        sorted_params.sort_by(|a, b| a.0.cmp(b.0));

        let params_string: String = sorted_params
            .iter()
            .map(|(k, v)| format!("{}={}", k, v))
            .collect::<Vec<_>>()
            .join("&");

        let to_sign = format!("{}{}", params_string, self.config.api_secret);
        let mut hasher = Sha1::new();
        hasher.update(to_sign.as_bytes());
        hex::encode(hasher.finalize())
    }

    pub async fn upload(
        &self,
        folder: &str,
        filename: &str,
        content_type: &str,
        data: Vec<u8>,
    ) -> AppResult<UploadResult> {
        self.validate_image(content_type, &data)?;

        let timestamp = chrono::Utc::now().timestamp().to_string();
        let public_id = format!("{}_{}", uuid::Uuid::now_v7(), sanitize_filename(filename));

        let full_folder = match &self.config.folder {
            Some(base) => format!("{}/{}", base, folder),
            None => folder.to_string(),
        };

        let params = [
            ("folder", full_folder.as_str()),
            ("public_id", public_id.as_str()),
            ("timestamp", timestamp.as_str()),
        ];

        let signature = self.generate_signature(&params);

        let file_part = Part::bytes(data)
            .file_name(filename.to_string())
            .mime_str(content_type)
            .map_err(|e| AppError::Internal(format!("Invalid content type: {}", e)))?;

        let form = Form::new()
            .part("file", file_part)
            .text("api_key", self.config.api_key.clone())
            .text("timestamp", timestamp)
            .text("signature", signature)
            .text("folder", full_folder)
            .text("public_id", public_id.clone());

        let response = self
            .client
            .post(self.config.upload_url())
            .multipart(form)
            .send()
            .await
            .map_err(|e| AppError::Internal(format!("Cloudinary upload failed: {}", e)))?;

        if !response.status().is_success() {
            let error_text = response.text().await.unwrap_or_default();
            return Err(AppError::Internal(format!(
                "Cloudinary upload failed: {}",
                error_text
            )));
        }

        let upload_response: CloudinaryUploadResponse = response.json().await.map_err(|e| {
            AppError::Internal(format!("Failed to parse Cloudinary response: {}", e))
        })?;

        Ok(UploadResult {
            public_id: upload_response.public_id,
            url: upload_response.secure_url,
            width: upload_response.width,
            height: upload_response.height,
            format: upload_response.format,
            bytes: upload_response.bytes,
        })
    }

    pub async fn upload_ad_image(
        &self,
        filename: &str,
        content_type: &str,
        data: Vec<u8>,
    ) -> AppResult<UploadResult> {
        self.upload("ad-images", filename, content_type, data).await
    }

    pub async fn upload_sponsor_logo(
        &self,
        filename: &str,
        content_type: &str,
        data: Vec<u8>,
    ) -> AppResult<UploadResult> {
        self.upload("logos", filename, content_type, data).await
    }

    fn validate_image(&self, content_type: &str, data: &[u8]) -> AppResult<()> {
        let allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if !allowed_types.contains(&content_type) {
            return Err(AppError::BadRequest(format!(
                "Invalid image type: {}. Allowed: {:?}",
                content_type, allowed_types
            )));
        }

        const MAX_SIZE: usize = 10 * 1024 * 1024;
        if data.len() > MAX_SIZE {
            return Err(AppError::BadRequest(format!(
                "Image too large: {} bytes. Max: {} bytes",
                data.len(),
                MAX_SIZE
            )));
        }

        Ok(())
    }

    pub async fn delete(&self, public_id: &str) -> AppResult<()> {
        let timestamp = chrono::Utc::now().timestamp().to_string();

        let params = [("public_id", public_id), ("timestamp", timestamp.as_str())];

        let signature = self.generate_signature(&params);

        let form = Form::new()
            .text("public_id", public_id.to_string())
            .text("api_key", self.config.api_key.clone())
            .text("timestamp", timestamp)
            .text("signature", signature);

        let response = self
            .client
            .post(self.config.delete_url())
            .multipart(form)
            .send()
            .await
            .map_err(|e| AppError::Internal(format!("Cloudinary delete failed: {}", e)))?;

        if !response.status().is_success() {
            let error_text = response.text().await.unwrap_or_default();
            return Err(AppError::Internal(format!(
                "Cloudinary delete failed: {}",
                error_text
            )));
        }

        Ok(())
    }

    pub fn transform_url(&self, public_id: &str, transformations: &ImageTransformations) -> String {
        let transform_string = transformations.to_string();

        if transform_string.is_empty() {
            format!(
                "https://res.cloudinary.com/{}/image/upload/{}",
                self.config.cloud_name, public_id
            )
        } else {
            format!(
                "https://res.cloudinary.com/{}/image/upload/{}/{}",
                self.config.cloud_name, transform_string, public_id
            )
        }
    }

    pub fn get_ad_image_url(&self, public_id: &str) -> String {
        self.transform_url(
            public_id,
            &ImageTransformations {
                width: Some(600),
                height: Some(400),
                crop: Some("fill".to_string()),
                quality: Some("auto".to_string()),
                format: Some("auto".to_string()),
            },
        )
    }

    pub fn get_logo_url(&self, public_id: &str) -> String {
        self.transform_url(
            public_id,
            &ImageTransformations {
                width: Some(200),
                height: Some(200),
                crop: Some("fit".to_string()),
                quality: Some("auto".to_string()),
                format: Some("auto".to_string()),
            },
        )
    }

    pub fn generate_upload_signature(&self, folder: &str) -> SignedUploadParams {
        let timestamp = chrono::Utc::now().timestamp();
        let public_id = uuid::Uuid::now_v7().to_string();

        let full_folder = match &self.config.folder {
            Some(base) => format!("{}/{}", base, folder),
            None => folder.to_string(),
        };

        let params = [
            ("folder", full_folder.as_str()),
            ("public_id", public_id.as_str()),
            ("timestamp", &timestamp.to_string()),
        ];

        let signature = self.generate_signature(&params);

        SignedUploadParams {
            cloud_name: self.config.cloud_name.clone(),
            api_key: self.config.api_key.clone(),
            timestamp,
            signature,
            folder: full_folder,
            public_id,
        }
    }
}

fn sanitize_filename(filename: &str) -> String {
    filename
        .chars()
        .filter(|c| c.is_alphanumeric() || *c == '-' || *c == '_' || *c == '.')
        .collect::<String>()
        .trim_end_matches('.')
        .to_string()
}

#[derive(Debug, Clone)]
pub struct UploadResult {
    pub public_id: String,
    pub url: String,
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub format: String,
    pub bytes: u64,
}

#[derive(Debug, Deserialize)]
struct CloudinaryUploadResponse {
    public_id: String,
    secure_url: String,
    width: Option<u32>,
    height: Option<u32>,
    format: String,
    bytes: u64,
}

#[derive(Debug, Default)]
pub struct ImageTransformations {
    pub width: Option<u32>,
    pub height: Option<u32>,
    pub crop: Option<String>,
    pub quality: Option<String>,
    pub format: Option<String>,
}

impl std::fmt::Display for ImageTransformations {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut parts = Vec::new();

        if let Some(w) = self.width {
            parts.push(format!("w_{}", w));
        }
        if let Some(h) = self.height {
            parts.push(format!("h_{}", h));
        }
        if let Some(ref c) = self.crop {
            parts.push(format!("c_{}", c));
        }
        if let Some(ref q) = self.quality {
            parts.push(format!("q_{}", q));
        }
        if let Some(ref fmt) = self.format {
            parts.push(format!("f_{}", fmt));
        }

        write!(f, "{}", parts.join(","))
    }
}

#[derive(Debug, Clone)]
pub struct SignedUploadParams {
    pub cloud_name: String,
    pub api_key: String,
    pub timestamp: i64,
    pub signature: String,
    pub folder: String,
    pub public_id: String,
}
