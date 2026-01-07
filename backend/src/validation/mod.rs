use crate::error::{AppError, AppResult};

pub const MIN_PASSWORD_LENGTH: usize = 8;
pub const MAX_PASSWORD_LENGTH: usize = 128;

pub fn validate_password(password: &str) -> AppResult<()> {
    if password.len() < MIN_PASSWORD_LENGTH {
        return Err(AppError::Validation(format!(
            "Password must be at least {} characters long",
            MIN_PASSWORD_LENGTH
        )));
    }

    if password.len() > MAX_PASSWORD_LENGTH {
        return Err(AppError::Validation(format!(
            "Password must not exceed {} characters",
            MAX_PASSWORD_LENGTH
        )));
    }

    let has_uppercase = password.chars().any(|c| c.is_ascii_uppercase());
    let has_lowercase = password.chars().any(|c| c.is_ascii_lowercase());
    let has_digit = password.chars().any(|c| c.is_ascii_digit());
    let has_special = password.chars().any(|c| !c.is_alphanumeric());

    if !has_uppercase {
        return Err(AppError::Validation(
            "Password must contain at least one uppercase letter".into(),
        ));
    }

    if !has_lowercase {
        return Err(AppError::Validation(
            "Password must contain at least one lowercase letter".into(),
        ));
    }

    if !has_digit {
        return Err(AppError::Validation(
            "Password must contain at least one digit".into(),
        ));
    }

    if !has_special {
        return Err(AppError::Validation(
            "Password must contain at least one special character".into(),
        ));
    }

    Ok(())
}

pub const MAX_HEADLINE_LENGTH: usize = 100;
pub const MAX_BODY_LENGTH: usize = 500;
pub const MAX_CTA_TEXT_LENGTH: usize = 50;
pub const MAX_URL_LENGTH: usize = 2048;

pub fn sanitize_text(input: &str) -> String {
    input
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#x27;")
        .trim()
        .to_string()
}

pub fn validate_url(url: &str) -> AppResult<String> {
    let url = url.trim();

    if url.is_empty() {
        return Err(AppError::Validation("URL cannot be empty".into()));
    }

    if url.len() > MAX_URL_LENGTH {
        return Err(AppError::Validation(format!(
            "URL exceeds maximum length of {} characters",
            MAX_URL_LENGTH
        )));
    }

    let lower_url = url.to_lowercase();
    if lower_url.starts_with("javascript:")
        || lower_url.starts_with("data:")
        || lower_url.starts_with("vbscript:")
    {
        return Err(AppError::Validation("Invalid URL protocol".into()));
    }

    if !lower_url.starts_with("http://") && !lower_url.starts_with("https://") {
        return Err(AppError::Validation(
            "URL must start with http:// or https://".into(),
        ));
    }

    Ok(url.to_string())
}

pub fn validate_ad_headline(headline: &str) -> AppResult<String> {
    let sanitized = sanitize_text(headline);

    if sanitized.is_empty() {
        return Err(AppError::Validation("Ad headline cannot be empty".into()));
    }

    if sanitized.len() > MAX_HEADLINE_LENGTH {
        return Err(AppError::Validation(format!(
            "Ad headline exceeds maximum length of {} characters",
            MAX_HEADLINE_LENGTH
        )));
    }

    Ok(sanitized)
}

pub fn validate_ad_body(body: &str) -> AppResult<String> {
    let sanitized = sanitize_text(body);

    if sanitized.is_empty() {
        return Err(AppError::Validation("Ad body cannot be empty".into()));
    }

    if sanitized.len() > MAX_BODY_LENGTH {
        return Err(AppError::Validation(format!(
            "Ad body exceeds maximum length of {} characters",
            MAX_BODY_LENGTH
        )));
    }

    Ok(sanitized)
}

pub fn validate_ad_cta_text(cta_text: Option<&str>) -> AppResult<Option<String>> {
    match cta_text {
        None => Ok(None),
        Some(text) => {
            let sanitized = sanitize_text(text);
            if sanitized.is_empty() {
                return Ok(None);
            }
            if sanitized.len() > MAX_CTA_TEXT_LENGTH {
                return Err(AppError::Validation(format!(
                    "CTA text exceeds maximum length of {} characters",
                    MAX_CTA_TEXT_LENGTH
                )));
            }
            Ok(Some(sanitized))
        }
    }
}

pub fn validate_image_url(url: Option<&str>) -> AppResult<Option<String>> {
    match url {
        None => Ok(None),
        Some(u) if u.trim().is_empty() => Ok(None),
        Some(u) => {
            let validated = validate_url(u)?;
            Ok(Some(validated))
        }
    }
}

#[derive(Debug)]
pub struct SanitizedBookingInput {
    pub ad_headline: String,
    pub ad_body: String,
    pub ad_cta_text: Option<String>,
    pub ad_cta_url: String,
    pub ad_image_url: Option<String>,
}

pub fn validate_booking_ad_content(
    ad_headline: &str,
    ad_body: &str,
    ad_cta_text: Option<&str>,
    ad_cta_url: &str,
    ad_image_url: Option<&str>,
) -> AppResult<SanitizedBookingInput> {
    Ok(SanitizedBookingInput {
        ad_headline: validate_ad_headline(ad_headline)?,
        ad_body: validate_ad_body(ad_body)?,
        ad_cta_text: validate_ad_cta_text(ad_cta_text)?,
        ad_cta_url: validate_url(ad_cta_url)?,
        ad_image_url: validate_image_url(ad_image_url)?,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sanitize_text_removes_html() {
        assert_eq!(
            sanitize_text("<script>alert('xss')</script>"),
            "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
        );
    }

    #[test]
    fn test_sanitize_text_preserves_normal_text() {
        assert_eq!(sanitize_text("Hello World"), "Hello World");
    }

    #[test]
    fn test_validate_url_rejects_javascript() {
        assert!(validate_url("javascript:alert('xss')").is_err());
    }

    #[test]
    fn test_validate_url_rejects_data() {
        assert!(validate_url("data:text/html,<script>alert('xss')</script>").is_err());
    }

    #[test]
    fn test_validate_url_accepts_https() {
        assert!(validate_url("https://example.com").is_ok());
    }

    #[test]
    fn test_validate_url_accepts_http() {
        assert!(validate_url("http://example.com").is_ok());
    }

    #[test]
    fn test_validate_url_rejects_non_http() {
        assert!(validate_url("ftp://example.com").is_err());
    }

    #[test]
    fn test_validate_ad_headline_empty() {
        assert!(validate_ad_headline("").is_err());
        assert!(validate_ad_headline("   ").is_err());
    }

    #[test]
    fn test_validate_ad_headline_too_long() {
        let long_headline = "a".repeat(MAX_HEADLINE_LENGTH + 1);
        assert!(validate_ad_headline(&long_headline).is_err());
    }

    #[test]
    fn test_validate_password_too_short() {
        assert!(validate_password("Abc1!").is_err());
    }

    #[test]
    fn test_validate_password_too_long() {
        let long_password = format!("Abc1!{}", "a".repeat(MAX_PASSWORD_LENGTH));
        assert!(validate_password(&long_password).is_err());
    }

    #[test]
    fn test_validate_password_no_uppercase() {
        assert!(validate_password("abcdefgh1!").is_err());
    }

    #[test]
    fn test_validate_password_no_lowercase() {
        assert!(validate_password("ABCDEFGH1!").is_err());
    }

    #[test]
    fn test_validate_password_no_digit() {
        assert!(validate_password("Abcdefgh!").is_err());
    }

    #[test]
    fn test_validate_password_no_special() {
        assert!(validate_password("Abcdefgh1").is_err());
    }

    #[test]
    fn test_validate_password_valid() {
        assert!(validate_password("Abcdefgh1!").is_ok());
        assert!(validate_password("MyP@ssw0rd").is_ok());
        assert!(validate_password("Str0ng#Pass").is_ok());
    }
}
