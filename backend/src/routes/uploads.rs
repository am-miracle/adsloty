use axum::{
    extract::{Multipart, Path, Query, State},
    routing::{delete, get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::error::{AppError, AppResult};
use crate::middlewares::Auth;
use crate::services::{storage::SignedUploadParams, ImageTransformations};
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/ad-image", post(upload_ad_image))
        .route("/sponsor-logo", post(upload_sponsor_logo))
        .route("/signed-params", get(get_signed_upload_params))
        .route("/image/{public_id}", delete(delete_image))
        .route("/transform", get(get_transformed_url))
}

#[derive(Debug, Serialize)]
struct UploadResponse {
    url: String,
    public_id: String,
    width: Option<u32>,
    height: Option<u32>,
    format: String,
    bytes: u64,
}

async fn upload_ad_image(
    State(state): State<AppState>,
    Auth(_user): Auth,
    mut multipart: Multipart,
) -> AppResult<Json<UploadResponse>> {
    let storage = state.require_storage()?;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| AppError::BadRequest(format!("Failed to read multipart: {}", e)))?
    {
        let filename = field
            .file_name()
            .map(|s| s.to_string())
            .unwrap_or_else(|| "image".to_string());

        let content_type = field
            .content_type()
            .map(|s| s.to_string())
            .unwrap_or_else(|| "image/jpeg".to_string());

        let data = field
            .bytes()
            .await
            .map_err(|e| AppError::BadRequest(format!("Failed to read file: {}", e)))?;

        let result = storage
            .upload_ad_image(&filename, &content_type, data.to_vec())
            .await?;

        return Ok(Json(UploadResponse {
            url: result.url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        }));
    }

    Err(AppError::BadRequest("No file provided".into()))
}

async fn upload_sponsor_logo(
    State(state): State<AppState>,
    Auth(_user): Auth,
    mut multipart: Multipart,
) -> AppResult<Json<UploadResponse>> {
    let storage = state.require_storage()?;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| AppError::BadRequest(format!("Failed to read multipart: {}", e)))?
    {
        let filename = field
            .file_name()
            .map(|s| s.to_string())
            .unwrap_or_else(|| "logo".to_string());

        let content_type = field
            .content_type()
            .map(|s| s.to_string())
            .unwrap_or_else(|| "image/png".to_string());

        let data = field
            .bytes()
            .await
            .map_err(|e| AppError::BadRequest(format!("Failed to read file: {}", e)))?;

        let result = storage
            .upload_sponsor_logo(&filename, &content_type, data.to_vec())
            .await?;

        return Ok(Json(UploadResponse {
            url: result.url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        }));
    }

    Err(AppError::BadRequest("No file provided".into()))
}

async fn get_signed_upload_params(
    State(state): State<AppState>,
    Auth(_user): Auth,
) -> AppResult<Json<SignedUploadParams>> {
    let storage = state.require_storage()?;
    let params = storage.generate_upload_signature("uploads");
    Ok(Json(params))
}

#[derive(Debug, Serialize)]
struct DeleteResponse {
    success: bool,
    message: String,
}

async fn delete_image(
    State(state): State<AppState>,
    Auth(_user): Auth,
    Path(public_id): Path<String>,
) -> AppResult<Json<DeleteResponse>> {
    let storage = state.require_storage()?;
    storage.delete(&public_id).await?;

    Ok(Json(DeleteResponse {
        success: true,
        message: format!("Image {} deleted successfully", public_id),
    }))
}

#[derive(Debug, Deserialize)]
struct TransformQuery {
    public_id: String,
    #[serde(default)]
    image_type: Option<String>,
}

#[derive(Debug, Serialize)]
struct TransformResponse {
    url: String,
    original_url: String,
}

async fn get_transformed_url(
    State(state): State<AppState>,
    Auth(_user): Auth,
    Query(query): Query<TransformQuery>,
) -> AppResult<Json<TransformResponse>> {
    let storage = state.require_storage()?;

    let transformed_url = match query.image_type.as_deref() {
        Some("ad") => storage.get_ad_image_url(&query.public_id),
        Some("logo") => storage.get_logo_url(&query.public_id),
        _ => storage.transform_url(&query.public_id, &ImageTransformations::default()),
    };

    let original_url = storage.transform_url(&query.public_id, &ImageTransformations::default());

    Ok(Json(TransformResponse {
        url: transformed_url,
        original_url,
    }))
}
