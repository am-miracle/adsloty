use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct SuccessResponse {
    pub success: bool,
    pub message: String,
}

impl SuccessResponse {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            success: true,
            message: message.into(),
        }
    }
}

#[derive(Debug, Serialize)]
pub struct DataResponse<T: Serialize> {
    pub success: bool,
    pub data: T,
}

impl<T: Serialize> DataResponse<T> {
    pub fn new(data: T) -> Self {
        Self {
            success: true,
            data,
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct PaginationMeta {
    pub total: i64,
    pub limit: i32,
    pub offset: i32,
    pub has_more: bool,
}

impl PaginationMeta {
    pub fn new(total: i64, limit: i32, offset: i32) -> Self {
        Self {
            total,
            limit,
            offset,
            has_more: (offset as i64 + limit as i64) < total,
        }
    }
}

#[derive(Debug, Serialize)]
pub struct PaginatedResponse<T: Serialize> {
    pub success: bool,
    pub data: Vec<T>,
    pub pagination: PaginationMeta,
}

impl<T: Serialize> PaginatedResponse<T> {
    pub fn new(data: Vec<T>, total: i64, limit: i32, offset: i32) -> Self {
        Self {
            success: true,
            data,
            pagination: PaginationMeta::new(total, limit, offset),
        }
    }
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct PaginationParams {
    #[serde(default = "default_limit")]
    pub limit: i32,
    #[serde(default)]
    pub offset: i32,
}

fn default_limit() -> i32 {
    20
}

impl Default for PaginationParams {
    fn default() -> Self {
        Self {
            limit: default_limit(),
            offset: 0,
        }
    }
}

impl PaginationParams {
    pub fn validated(self) -> Self {
        Self {
            limit: self.limit.clamp(1, 100),
            offset: self.offset.max(0),
        }
    }
}
