use chrono::NaiveDate;
use sqlx::{PgPool, Postgres, Transaction};
use uuid::Uuid;

use crate::models::{
    Booking, BookingStatus, BookingWithDetails, CreateSponsor, Sponsor, UpdateSponsor, Writer,
};
use crate::validation::SanitizedBookingInput;

#[derive(Debug)]
pub enum CreateBookingError {
    SlotNotAvailable,
    Database(sqlx::Error),
}

impl From<sqlx::Error> for CreateBookingError {
    fn from(err: sqlx::Error) -> Self {
        CreateBookingError::Database(err)
    }
}

pub async fn create_sponsor(
    pool: &PgPool,
    user_id: Uuid,
    input: &CreateSponsor,
) -> Result<Sponsor, sqlx::Error> {
    sqlx::query_as!(
        Sponsor,
        r#"
        INSERT INTO sponsors (user_id, company_name, website_url, logo_url, billing_email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        "#,
        user_id,
        input.company_name,
        input.website_url,
        input.logo_url,
        input.billing_email
    )
    .fetch_one(pool)
    .await
}

pub async fn get_sponsor_by_id(pool: &PgPool, id: Uuid) -> Result<Option<Sponsor>, sqlx::Error> {
    sqlx::query_as!(Sponsor, "SELECT * FROM sponsors WHERE id = $1", id)
        .fetch_optional(pool)
        .await
}

pub async fn get_sponsor_by_user_id(
    pool: &PgPool,
    user_id: Uuid,
) -> Result<Option<Sponsor>, sqlx::Error> {
    sqlx::query_as!(
        Sponsor,
        "SELECT * FROM sponsors WHERE user_id = $1",
        user_id
    )
    .fetch_optional(pool)
    .await
}

pub async fn update_sponsor(
    pool: &PgPool,
    sponsor_id: Uuid,
    input: &UpdateSponsor,
) -> Result<Sponsor, sqlx::Error> {
    sqlx::query_as!(
        Sponsor,
        r#"
        UPDATE sponsors
        SET company_name = COALESCE($1, company_name),
            website_url = COALESCE($2, website_url),
            logo_url = COALESCE($3, logo_url),
            billing_email = COALESCE($4, billing_email),
            updated_at = NOW()
        WHERE id = $5
        RETURNING *
        "#,
        input.company_name,
        input.website_url,
        input.logo_url,
        input.billing_email,
        sponsor_id
    )
    .fetch_one(pool)
    .await
}

async fn check_slot_available_tx(
    tx: &mut Transaction<'_, Postgres>,
    writer_id: Uuid,
    slot_date: NaiveDate,
) -> Result<bool, sqlx::Error> {
    let result: (i32, i64, bool) = sqlx::query_as(
        r#"
        SELECT
            w.slots_per_week,
            (
                SELECT COUNT(*) FROM bookings b
                WHERE b.writer_id = $1 AND b.slot_date = $2
                AND b.status NOT IN ('rejected', 'cancelled', 'refunded')
            ),
            EXISTS (
                SELECT 1 FROM blackout_dates bl
                WHERE bl.writer_id = $1 AND bl.blocked_date = $2
            )
        FROM writers w
        WHERE w.id = $1
        FOR UPDATE OF w
        "#,
    )
    .bind(writer_id)
    .bind(slot_date)
    .fetch_one(&mut **tx)
    .await?;

    let (slots_per_week, booked_count, is_blackout) = result;
    Ok(!is_blackout && (booked_count as i32) < slots_per_week)
}

pub async fn create_booking_with_availability_check(
    pool: &PgPool,
    sponsor_id: Uuid,
    writer: &Writer,
    slot_date: NaiveDate,
    ad_content: &SanitizedBookingInput,
    lemon_order_id: &str,
) -> Result<Booking, CreateBookingError> {
    let mut tx = pool.begin().await?;

    let available = check_slot_available_tx(&mut tx, writer.id, slot_date).await?;
    if !available {
        tx.rollback().await?;
        return Err(CreateBookingError::SlotNotAvailable);
    }

    let amount_cents = writer.price_per_slot;
    let platform_fee_cents = (amount_cents as f64
        * (writer
            .platform_fee_pct
            .to_string()
            .parse::<f64>()
            .unwrap_or(10.0)
            / 100.0)) as i32;
    let writer_payout_cents = amount_cents - platform_fee_cents;

    let booking = sqlx::query_as!(
        Booking,
        r#"
        INSERT INTO bookings (
            writer_id, sponsor_id, slot_date, ad_headline, ad_body,
            ad_cta_text, ad_cta_url, ad_image_url, status,
            amount_cents, platform_fee_cents, writer_payout_cents, currency,
            lemon_order_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending_payment', $9, $10, $11, $12, $13)
        RETURNING id, writer_id, sponsor_id, slot_date, ad_headline, ad_body,
                  ad_cta_text, ad_cta_url, ad_image_url,
                  status as "status: BookingStatus",
                  amount_cents, platform_fee_cents, writer_payout_cents, currency,
                  lemon_order_id,
                  created_at, paid_at, approved_at, rejected_at, published_at
        "#,
        writer.id,
        sponsor_id,
        slot_date,
        ad_content.ad_headline,
        ad_content.ad_body,
        ad_content.ad_cta_text,
        ad_content.ad_cta_url,
        ad_content.ad_image_url,
        amount_cents,
        platform_fee_cents,
        writer_payout_cents,
        writer.currency,
        lemon_order_id
    )
    .fetch_one(&mut *tx)
    .await?;

    tx.commit().await?;

    Ok(booking)
}

pub async fn get_booking_by_id(pool: &PgPool, id: Uuid) -> Result<Option<Booking>, sqlx::Error> {
    sqlx::query_as!(
        Booking,
        r#"
        SELECT id, writer_id, sponsor_id, slot_date, ad_headline, ad_body,
               ad_cta_text, ad_cta_url, ad_image_url,
               status as "status: BookingStatus",
               amount_cents, platform_fee_cents, writer_payout_cents, currency,
               lemon_order_id,
               created_at, paid_at, approved_at, rejected_at, published_at
        FROM bookings WHERE id = $1
        "#,
        id
    )
    .fetch_optional(pool)
    .await
}

pub async fn get_booking_by_lemon_order(
    pool: &PgPool,
    lemon_order_id: &str,
) -> Result<Option<Booking>, sqlx::Error> {
    sqlx::query_as!(
        Booking,
        r#"
        SELECT id, writer_id, sponsor_id, slot_date, ad_headline, ad_body,
               ad_cta_text, ad_cta_url, ad_image_url,
               status as "status: BookingStatus",
               amount_cents, platform_fee_cents, writer_payout_cents, currency,
               lemon_order_id,
               created_at, paid_at, approved_at, rejected_at, published_at
        FROM bookings WHERE lemon_order_id = $1
        "#,
        lemon_order_id
    )
    .fetch_optional(pool)
    .await
}

pub async fn update_booking_status(
    pool: &PgPool,
    booking_id: Uuid,
    status: BookingStatus,
) -> Result<(), sqlx::Error> {
    let timestamp_field = match status {
        BookingStatus::Paid => "paid_at",
        BookingStatus::Approved => "approved_at",
        BookingStatus::Rejected => "rejected_at",
        BookingStatus::Published => "published_at",
        _ => "",
    };

    if timestamp_field.is_empty() {
        sqlx::query!(
            "UPDATE bookings SET status = $1 WHERE id = $2",
            status as BookingStatus,
            booking_id
        )
        .execute(pool)
        .await?;
    } else {
        // Use raw query for dynamic column
        let query = format!(
            "UPDATE bookings SET status = $1, {} = NOW() WHERE id = $2",
            timestamp_field
        );
        sqlx::query(&query)
            .bind(status as BookingStatus)
            .bind(booking_id)
            .execute(pool)
            .await?;
    }
    Ok(())
}

pub async fn get_writer_bookings(
    pool: &PgPool,
    writer_id: Uuid,
) -> Result<Vec<BookingWithDetails>, sqlx::Error> {
    sqlx::query_as!(
        BookingWithDetails,
        r#"
        SELECT
            b.id, b.slot_date, b.ad_headline, b.ad_body, b.ad_cta_text, b.ad_cta_url, b.ad_image_url,
            b.status as "status: BookingStatus",
            b.amount_cents, b.platform_fee_cents, b.writer_payout_cents, b.currency,
            b.created_at, b.paid_at, b.approved_at, b.published_at,
            b.writer_id, w.newsletter_name,
            b.sponsor_id, s.company_name, s.logo_url as sponsor_logo_url
        FROM bookings b
        JOIN writers w ON w.id = b.writer_id
        JOIN sponsors s ON s.id = b.sponsor_id
        WHERE b.writer_id = $1
        ORDER BY b.slot_date DESC
        "#,
        writer_id
    )
    .fetch_all(pool)
    .await
}

pub async fn get_writer_upcoming_bookings(
    pool: &PgPool,
    writer_id: Uuid,
    weeks: i32,
) -> Result<Vec<BookingWithDetails>, sqlx::Error> {
    sqlx::query_as!(
        BookingWithDetails,
        r#"
        SELECT
            b.id, b.slot_date, b.ad_headline, b.ad_body, b.ad_cta_text, b.ad_cta_url, b.ad_image_url,
            b.status as "status: BookingStatus",
            b.amount_cents, b.platform_fee_cents, b.writer_payout_cents, b.currency,
            b.created_at, b.paid_at, b.approved_at, b.published_at,
            b.writer_id, w.newsletter_name,
            b.sponsor_id, s.company_name, s.logo_url as sponsor_logo_url
        FROM bookings b
        JOIN writers w ON w.id = b.writer_id
        JOIN sponsors s ON s.id = b.sponsor_id
        WHERE b.writer_id = $1
          AND b.slot_date >= CURRENT_DATE
          AND b.slot_date <= CURRENT_DATE + ($2 || ' weeks')::INTERVAL
          AND b.status IN ('paid', 'approved', 'published')
        ORDER BY b.slot_date ASC
        "#,
        writer_id,
        weeks.to_string()
    )
    .fetch_all(pool)
    .await
}

pub async fn get_sponsor_bookings(
    pool: &PgPool,
    sponsor_id: Uuid,
) -> Result<Vec<BookingWithDetails>, sqlx::Error> {
    sqlx::query_as!(
        BookingWithDetails,
        r#"
        SELECT
            b.id, b.slot_date, b.ad_headline, b.ad_body, b.ad_cta_text, b.ad_cta_url, b.ad_image_url,
            b.status as "status: BookingStatus",
            b.amount_cents, b.platform_fee_cents, b.writer_payout_cents, b.currency,
            b.created_at, b.paid_at, b.approved_at, b.published_at,
            b.writer_id, w.newsletter_name,
            b.sponsor_id, s.company_name, s.logo_url as sponsor_logo_url
        FROM bookings b
        JOIN writers w ON w.id = b.writer_id
        JOIN sponsors s ON s.id = b.sponsor_id
        WHERE b.sponsor_id = $1
        ORDER BY b.slot_date DESC
        "#,
        sponsor_id
    )
    .fetch_all(pool)
    .await
}

#[derive(Debug, Default)]
pub struct BookingFilters {
    pub status: Option<BookingStatus>,
    pub from_date: Option<NaiveDate>,
    pub to_date: Option<NaiveDate>,
}

#[derive(Debug, Clone, Copy, Default)]
pub enum BookingSortBy {
    #[default]
    SlotDateDesc,
    SlotDateAsc,
    CreatedAtDesc,
    CreatedAtAsc,
    AmountDesc,
    AmountAsc,
}

#[derive(Debug)]
pub struct PaginatedBookings {
    pub bookings: Vec<BookingWithDetails>,
    pub total: i64,
}

pub async fn get_writer_bookings_paginated(
    pool: &PgPool,
    writer_id: Uuid,
    limit: i32,
    offset: i32,
    filters: &BookingFilters,
    sort_by: BookingSortBy,
) -> Result<PaginatedBookings, sqlx::Error> {
    let order_clause = match sort_by {
        BookingSortBy::SlotDateDesc => "b.slot_date DESC",
        BookingSortBy::SlotDateAsc => "b.slot_date ASC",
        BookingSortBy::CreatedAtDesc => "b.created_at DESC",
        BookingSortBy::CreatedAtAsc => "b.created_at ASC",
        BookingSortBy::AmountDesc => "b.amount_cents DESC",
        BookingSortBy::AmountAsc => "b.amount_cents ASC",
    };

    let total: i64 = sqlx::query_scalar(&format!(
        r#"
            SELECT COUNT(*)
            FROM bookings b
            WHERE b.writer_id = $1
            {}
            {}
            {}
            "#,
        filters.status.map(|_| "AND b.status = $4").unwrap_or(""),
        filters
            .from_date
            .map(|_| "AND b.slot_date >= $5")
            .unwrap_or(""),
        filters
            .to_date
            .map(|_| "AND b.slot_date <= $6")
            .unwrap_or(""),
    ))
    .bind(writer_id)
    .bind(limit)
    .bind(offset)
    .bind(filters.status.map(|s| format!("{:?}", s).to_lowercase()))
    .bind(filters.from_date)
    .bind(filters.to_date)
    .fetch_one(pool)
    .await
    .unwrap_or(0);

    let bookings: Vec<BookingWithDetails> = sqlx::query_as(
        &format!(
            r#"
            SELECT
                b.id, b.slot_date, b.ad_headline, b.ad_body, b.ad_cta_text, b.ad_cta_url, b.ad_image_url,
                b.status as "status: BookingStatus",
                b.amount_cents, b.platform_fee_cents, b.writer_payout_cents, b.currency,
                b.created_at, b.paid_at, b.approved_at, b.published_at,
                b.writer_id, w.newsletter_name,
                b.sponsor_id, s.company_name, s.logo_url as sponsor_logo_url
            FROM bookings b
            JOIN writers w ON w.id = b.writer_id
            JOIN sponsors s ON s.id = b.sponsor_id
            WHERE b.writer_id = $1
            {}
            {}
            {}
            ORDER BY {}
            LIMIT $2 OFFSET $3
            "#,
            filters.status.map(|_| "AND b.status = $4::booking_status").unwrap_or(""),
            filters.from_date.map(|_| "AND b.slot_date >= $5").unwrap_or(""),
            filters.to_date.map(|_| "AND b.slot_date <= $6").unwrap_or(""),
            order_clause
        )
    )
    .bind(writer_id)
    .bind(limit)
    .bind(offset)
    .bind(filters.status.map(|s| format!("{:?}", s).to_lowercase()))
    .bind(filters.from_date)
    .bind(filters.to_date)
    .fetch_all(pool)
    .await?;

    Ok(PaginatedBookings { bookings, total })
}

pub async fn get_sponsor_bookings_paginated(
    pool: &PgPool,
    sponsor_id: Uuid,
    limit: i32,
    offset: i32,
    filters: &BookingFilters,
    sort_by: BookingSortBy,
) -> Result<PaginatedBookings, sqlx::Error> {
    let order_clause = match sort_by {
        BookingSortBy::SlotDateDesc => "b.slot_date DESC",
        BookingSortBy::SlotDateAsc => "b.slot_date ASC",
        BookingSortBy::CreatedAtDesc => "b.created_at DESC",
        BookingSortBy::CreatedAtAsc => "b.created_at ASC",
        BookingSortBy::AmountDesc => "b.amount_cents DESC",
        BookingSortBy::AmountAsc => "b.amount_cents ASC",
    };

    let total: i64 = sqlx::query_scalar(&format!(
        r#"
            SELECT COUNT(*)
            FROM bookings b
            WHERE b.sponsor_id = $1
            {}
            {}
            {}
            "#,
        filters.status.map(|_| "AND b.status = $4").unwrap_or(""),
        filters
            .from_date
            .map(|_| "AND b.slot_date >= $5")
            .unwrap_or(""),
        filters
            .to_date
            .map(|_| "AND b.slot_date <= $6")
            .unwrap_or(""),
    ))
    .bind(sponsor_id)
    .bind(limit)
    .bind(offset)
    .bind(filters.status.map(|s| format!("{:?}", s).to_lowercase()))
    .bind(filters.from_date)
    .bind(filters.to_date)
    .fetch_one(pool)
    .await
    .unwrap_or(0);

    let bookings: Vec<BookingWithDetails> = sqlx::query_as(
        &format!(
            r#"
            SELECT
                b.id, b.slot_date, b.ad_headline, b.ad_body, b.ad_cta_text, b.ad_cta_url, b.ad_image_url,
                b.status as "status: BookingStatus",
                b.amount_cents, b.platform_fee_cents, b.writer_payout_cents, b.currency,
                b.created_at, b.paid_at, b.approved_at, b.published_at,
                b.writer_id, w.newsletter_name,
                b.sponsor_id, s.company_name, s.logo_url as sponsor_logo_url
            FROM bookings b
            JOIN writers w ON w.id = b.writer_id
            JOIN sponsors s ON s.id = b.sponsor_id
            WHERE b.sponsor_id = $1
            {}
            {}
            {}
            ORDER BY {}
            LIMIT $2 OFFSET $3
            "#,
            filters.status.map(|_| "AND b.status = $4::booking_status").unwrap_or(""),
            filters.from_date.map(|_| "AND b.slot_date >= $5").unwrap_or(""),
            filters.to_date.map(|_| "AND b.slot_date <= $6").unwrap_or(""),
            order_clause
        )
    )
    .bind(sponsor_id)
    .bind(limit)
    .bind(offset)
    .bind(filters.status.map(|s| format!("{:?}", s).to_lowercase()))
    .bind(filters.from_date)
    .bind(filters.to_date)
    .fetch_all(pool)
    .await?;

    Ok(PaginatedBookings { bookings, total })
}

// update booking ad content (only allowed before approval)
pub async fn update_booking_ad_content(
    pool: &PgPool,
    booking_id: Uuid,
    ad_content: &SanitizedBookingInput,
) -> Result<Booking, sqlx::Error> {
    let sql = r#"
        UPDATE bookings
        SET ad_headline = $2,
            ad_body = $3,
            ad_cta_text = $4,
            ad_cta_url = $5,
            ad_image_url = $6
        WHERE id = $1
        RETURNING id, writer_id, sponsor_id, slot_date, ad_headline, ad_body,
                  ad_cta_text, ad_cta_url, ad_image_url,
                  status, amount_cents, platform_fee_cents, writer_payout_cents, currency,
                  lemon_order_id,
                  created_at, paid_at, approved_at, rejected_at, published_at
    "#;

    sqlx::query_as::<_, Booking>(sql)
        .bind(booking_id)
        .bind(&ad_content.ad_headline)
        .bind(&ad_content.ad_body)
        .bind(&ad_content.ad_cta_text)
        .bind(&ad_content.ad_cta_url)
        .bind(&ad_content.ad_image_url)
        .fetch_one(pool)
        .await
}
