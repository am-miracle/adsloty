use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{Booking, BookingStatus, Payout, PayoutStatus};

pub async fn get_writer_payouts(
    pool: &PgPool,
    writer_id: Uuid,
) -> Result<Vec<Payout>, sqlx::Error> {
    sqlx::query_as!(
        Payout,
        r#"
        SELECT id, writer_id, amount_cents, currency,
               status as "status: PayoutStatus",
               lemon_payout_id, booking_ids,
               created_at, paid_at, failed_at, failure_reason
        FROM payouts
        WHERE writer_id = $1
        ORDER BY created_at DESC
        "#,
        writer_id
    )
    .fetch_all(pool)
    .await
}

pub async fn create_payout(
    pool: &PgPool,
    writer_id: Uuid,
    amount_cents: i32,
    currency: &str,
    booking_ids: &[Uuid],
    lemon_payout_id: &str,
) -> Result<Payout, sqlx::Error> {
    sqlx::query_as!(
        Payout,
        r#"
        INSERT INTO payouts (writer_id, amount_cents, currency, booking_ids, lemon_payout_id, status)
        VALUES ($1, $2, $3, $4, $5, 'processing')
        RETURNING id, writer_id, amount_cents, currency,
                  status as "status: PayoutStatus",
                  lemon_payout_id, booking_ids,
                  created_at, paid_at, failed_at, failure_reason
        "#,
        writer_id,
        amount_cents,
        currency,
        booking_ids,
        lemon_payout_id
    )
    .fetch_one(pool)
    .await
}

pub async fn update_payout_status(
    pool: &PgPool,
    payout_id: Uuid,
    status: PayoutStatus,
    failure_reason: Option<&str>,
) -> Result<(), sqlx::Error> {
    match status {
        PayoutStatus::Paid => {
            sqlx::query!(
                "UPDATE payouts SET status = $1, paid_at = NOW() WHERE id = $2",
                status as PayoutStatus,
                payout_id
            )
            .execute(pool)
            .await?;
        }
        PayoutStatus::Failed => {
            sqlx::query!(
                "UPDATE payouts SET status = $1, failed_at = NOW(), failure_reason = $2 WHERE id = $3",
                status as PayoutStatus,
                failure_reason,
                payout_id
            )
            .execute(pool)
            .await?;
        }
        _ => {
            sqlx::query!(
                "UPDATE payouts SET status = $1 WHERE id = $2",
                status as PayoutStatus,
                payout_id
            )
            .execute(pool)
            .await?;
        }
    }
    Ok(())
}

pub async fn get_eligible_bookings_for_payout(
    pool: &PgPool,
    writer_id: Uuid,
) -> Result<Vec<Booking>, sqlx::Error> {
    sqlx::query_as!(
        Booking,
        r#"
        SELECT id, writer_id, sponsor_id, slot_date, ad_headline, ad_body,
               ad_cta_text, ad_cta_url, ad_image_url,
               status as "status: BookingStatus",
               amount_cents, platform_fee_cents, writer_payout_cents, currency,
               lemon_order_id,
               created_at, paid_at, approved_at, rejected_at, published_at
        FROM bookings
        WHERE writer_id = $1
          AND status = 'published'
          AND id NOT IN (SELECT UNNEST(booking_ids) FROM payouts WHERE status IN ('processing', 'paid'))
        ORDER BY published_at
        "#,
        writer_id
    )
    .fetch_all(pool)
    .await
}
