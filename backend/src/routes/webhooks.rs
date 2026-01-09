use axum::{
    body::Bytes,
    extract::State,
    http::{HeaderMap, StatusCode},
    routing::post,
    Router,
};
use uuid::Uuid;

use crate::db;
use crate::models::BookingStatus;
use crate::services::{BookingConfirmationData, NewBookingNotificationData};
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new().route("/lemon-squeezy", post(lemon_squeezy_webhook))
}

async fn lemon_squeezy_webhook(
    State(state): State<AppState>,
    headers: HeaderMap,
    body: Bytes,
) -> StatusCode {
    let signature = match headers.get("x-signature") {
        Some(sig) => match sig.to_str() {
            Ok(s) => s.to_string(),
            Err(_) => {
                tracing::warn!("Invalid signature header encoding");
                return StatusCode::BAD_REQUEST;
            }
        },
        None => {
            tracing::warn!("Missing x-signature header");
            return StatusCode::BAD_REQUEST;
        }
    };

    let payments = match state.payments.as_ref() {
        Some(p) => p,
        None => {
            tracing::error!("Payment service not configured");
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    };

    if let Err(e) = payments.verify_webhook(&body, &signature) {
        tracing::warn!("Webhook signature verification failed: {}", e);
        return StatusCode::UNAUTHORIZED;
    }

    let payload = match std::str::from_utf8(&body) {
        Ok(s) => s,
        Err(_) => {
            tracing::warn!("Invalid UTF-8 in webhook payload");
            return StatusCode::BAD_REQUEST;
        }
    };

    let event = match payments.parse_webhook_event(payload) {
        Ok(e) => e,
        Err(e) => {
            tracing::warn!("Failed to parse webhook event: {}", e);
            return StatusCode::BAD_REQUEST;
        }
    };

    tracing::info!("Received Lemon Squeezy webhook: {}", event.meta.event_name);

    if event.is_order_created() {
        if let Err(e) = handle_order_created(&state, &event).await {
            tracing::error!("Failed to handle order_created: {}", e);
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    } else if event.is_order_refunded() {
        if let Err(e) = handle_order_refunded(&state, &event).await {
            tracing::error!("Failed to handle order_refunded: {}", e);
            return StatusCode::INTERNAL_SERVER_ERROR;
        }
    } else {
        tracing::debug!("Ignoring unhandled event type: {}", event.meta.event_name);
    }

    StatusCode::OK
}

async fn handle_order_created(
    state: &AppState,
    event: &crate::services::WebhookEvent,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let booking_id_str = event
        .get_custom_data("booking_id")
        .ok_or("Missing booking_id in custom data")?;

    let booking_id = Uuid::parse_str(booking_id_str)?;

    let booking = db::sponsor::get_booking_by_id(&state.db, booking_id)
        .await?
        .ok_or("Booking not found")?;

    if booking.status != BookingStatus::PendingPayment {
        tracing::info!(
            "Booking {} already processed, status: {:?}",
            booking_id,
            booking.status
        );
        return Ok(());
    }

    let order_id = &event.data.id;

    // Extract order attributes for logging and verification
    if let Some(order_attrs) = event.get_order_attributes() {
        tracing::info!(
            "Order {} created: {} {} (status: {}, refunded: {})",
            order_attrs.order_number,
            order_attrs.total as f64 / 100.0,
            order_attrs.currency.to_uppercase(),
            order_attrs.status,
            order_attrs.refunded
        );

        // Verify the order amount matches the booking
        if order_attrs.total != booking.amount_cents as i64 {
            tracing::warn!(
                "Order amount mismatch: expected {} but got {}",
                booking.amount_cents,
                order_attrs.total
            );
        }
    }

    sqlx::query!(
        "UPDATE bookings SET lemon_order_id = $1 WHERE id = $2",
        order_id,
        booking_id
    )
    .execute(&state.db)
    .await?;

    db::sponsor::update_booking_status(&state.db, booking_id, BookingStatus::Paid).await?;

    tracing::info!(
        "Booking {} marked as paid (order: {})",
        booking_id,
        order_id
    );

    let writer = db::writer::get_writer_by_id(&state.db, booking.writer_id).await?;
    let sponsor = db::sponsor::get_sponsor_by_id(&state.db, booking.sponsor_id).await?;

    let auto_approved = if let Some(ref writer) = writer {
        if writer.auto_approve {
            db::sponsor::update_booking_status(&state.db, booking_id, BookingStatus::Approved)
                .await?;
            tracing::info!("Booking {} auto-approved", booking_id);
            true
        } else {
            false
        }
    } else {
        false
    };

    if let Some(email_service) = &state.email {
        let frontend_url = &state.config.server.frontend_url;

        if let Some(ref sponsor) = sponsor {
            if let Some(ref billing_email) = sponsor.billing_email {
                if let Some(ref writer) = writer {
                    let email_data = BookingConfirmationData {
                        newsletter_name: writer.newsletter_name.clone(),
                        slot_date: booking.slot_date.to_string(),
                        amount_cents: booking.amount_cents,
                        currency: booking.currency.clone(),
                        ad_headline: booking.ad_headline.clone(),
                        ad_body: booking.ad_body.clone(),
                        ad_cta_text: booking.ad_cta_text.clone(),
                        ad_cta_url: booking.ad_cta_url.clone(),
                        dashboard_url: format!("{}/dashboard/bookings", frontend_url),
                    };
                    if let Err(e) = email_service
                        .send_booking_confirmation(billing_email, email_data)
                        .await
                    {
                        tracing::warn!("Failed to send booking confirmation email: {}", e);
                    }
                }
            }
        }

        if !auto_approved {
            if let Some(ref writer) = writer {
                if let Ok(Some(user)) = db::user::get_user_by_id(&state.db, writer.user_id).await {
                    if let Some(ref sponsor) = sponsor {
                        let email_data = NewBookingNotificationData {
                            sponsor_name: sponsor.company_name.clone(),
                            company_website: sponsor.website_url.clone(),
                            slot_date: booking.slot_date.to_string(),
                            writer_payout_cents: booking.writer_payout_cents,
                            ad_headline: booking.ad_headline.clone(),
                            ad_body: booking.ad_body.clone(),
                            ad_cta_text: booking.ad_cta_text.clone(),
                            ad_cta_url: booking.ad_cta_url.clone(),
                            dashboard_url: format!("{}/dashboard/bookings", frontend_url),
                        };
                        if let Err(e) = email_service
                            .send_new_booking_notification(&user.email, email_data)
                            .await
                        {
                            tracing::warn!("Failed to send new booking notification email: {}", e);
                        }
                    }
                }
            }
        }
    }

    Ok(())
}

async fn handle_order_refunded(
    state: &AppState,
    event: &crate::services::WebhookEvent,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let order_id = &event.data.id;

    // Log refund details from order attributes
    if let Some(order_attrs) = event.get_order_attributes() {
        tracing::info!(
            "Order {} refunded at {}: {} {} refunded",
            order_attrs.order_number,
            order_attrs.refunded_at.as_deref().unwrap_or("unknown"),
            order_attrs.total as f64 / 100.0,
            order_attrs.currency.to_uppercase()
        );
    }

    let booking = db::sponsor::get_booking_by_lemon_order(&state.db, order_id)
        .await?
        .ok_or_else(|| format!("Booking not found for order {}", order_id))?;

    match booking.status {
        BookingStatus::Paid | BookingStatus::Approved => {
            db::sponsor::update_booking_status(&state.db, booking.id, BookingStatus::Refunded)
                .await?;
            tracing::info!("Booking {} marked as refunded", booking.id);

            if let Some(email_service) = &state.email {
                let writer = db::writer::get_writer_by_id(&state.db, booking.writer_id).await?;
                let sponsor = db::sponsor::get_sponsor_by_id(&state.db, booking.sponsor_id).await?;

                if let Some(ref sponsor) = sponsor {
                    if let Some(ref billing_email) = sponsor.billing_email {
                        if let Some(ref writer) = writer {
                            let email_data = crate::services::BookingRejectedData {
                                newsletter_name: writer.newsletter_name.clone(),
                                slot_date: booking.slot_date.to_string(),
                                amount_cents: booking.amount_cents,
                                currency: booking.currency.clone(),
                                reason: Some("Order was refunded".to_string()),
                            };
                            if let Err(e) = email_service
                                .send_booking_rejected(billing_email, email_data)
                                .await
                            {
                                tracing::warn!("Failed to send refund notification email: {}", e);
                            }
                        }
                    }
                }

                if let Some(ref writer) = writer {
                    if let Ok(Some(user)) =
                        db::user::get_user_by_id(&state.db, writer.user_id).await
                    {
                        if let Some(ref _sponsor) = sponsor {
                            tracing::info!(
                                "Booking {} cancelled/refunded - writer {} notified",
                                booking.id,
                                user.email
                            );
                        }
                    }
                }
            }
        }
        _ => {
            tracing::info!(
                "Booking {} not in refundable state: {:?}",
                booking.id,
                booking.status
            );
        }
    }

    Ok(())
}
