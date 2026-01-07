

CREATE TYPE user_role AS ENUM ('writer', 'sponsor', 'admin');
CREATE TYPE booking_status AS ENUM ('pending_payment', 'paid', 'approved', 'rejected', 'published', 'cancelled', 'refunded');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'paid', 'failed');



CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255) NOT NULL UNIQUE,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    role                user_role NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at       TIMESTAMPTZ,
    reset_token         VARCHAR(255),
    reset_token_expires TIMESTAMPTZ
);

CREATE TABLE writers (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    newsletter_name             VARCHAR(255) NOT NULL,
    newsletter_url              VARCHAR(500),
    description                 TEXT,
    subscriber_count            INTEGER,

    price_per_slot              INTEGER NOT NULL,
    currency                    CHAR(3) NOT NULL DEFAULT 'usd',

    lead_time_days              INTEGER NOT NULL DEFAULT 7,
    slots_per_week              INTEGER NOT NULL DEFAULT 1,

    auto_approve                BOOLEAN NOT NULL DEFAULT FALSE,
    platform_fee_pct            NUMERIC(5,2) NOT NULL DEFAULT 10.00,

    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sponsors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    company_name    VARCHAR(255) NOT NULL,
    website_url     VARCHAR(500),
    logo_url        VARCHAR(500),

    billing_email   VARCHAR(255),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    writer_id                   UUID NOT NULL REFERENCES writers(id),
    sponsor_id                  UUID NOT NULL REFERENCES sponsors(id),

    slot_date                   DATE NOT NULL,

    ad_headline                 VARCHAR(255) NOT NULL,
    ad_body                     TEXT NOT NULL,
    ad_cta_text                 VARCHAR(100),
    ad_cta_url                  VARCHAR(500) NOT NULL,
    ad_image_url                VARCHAR(500),

    status                      booking_status NOT NULL DEFAULT 'pending_payment',

    amount_cents                INTEGER NOT NULL,
    platform_fee_cents          INTEGER NOT NULL,
    writer_payout_cents         INTEGER NOT NULL,
    currency                    CHAR(3) NOT NULL DEFAULT 'usd',

    lemon_order_id              VARCHAR(255),

    created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at                     TIMESTAMPTZ,
    approved_at                 TIMESTAMPTZ,
    rejected_at                 TIMESTAMPTZ,
    published_at                TIMESTAMPTZ,

    UNIQUE(writer_id, slot_date)
);

CREATE TABLE blackout_dates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    writer_id       UUID NOT NULL REFERENCES writers(id) ON DELETE CASCADE,
    blocked_date    DATE NOT NULL,
    reason          VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(writer_id, blocked_date)
);

CREATE TABLE payouts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    writer_id           UUID NOT NULL REFERENCES writers(id),

    amount_cents        INTEGER NOT NULL,
    currency            CHAR(3) NOT NULL DEFAULT 'usd',

    status              payout_status NOT NULL DEFAULT 'pending',

    lemon_payout_id     VARCHAR(255),

    booking_ids         UUID[] NOT NULL,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at             TIMESTAMPTZ,
    failed_at           TIMESTAMPTZ,
    failure_reason      TEXT
);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_reset_token ON users(reset_token) WHERE reset_token IS NOT NULL;

CREATE INDEX idx_writers_user_id ON writers(user_id);

CREATE INDEX idx_sponsors_user_id ON sponsors(user_id);

CREATE INDEX idx_bookings_writer_id ON bookings(writer_id);
CREATE INDEX idx_bookings_sponsor_id ON bookings(sponsor_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_slot_date ON bookings(slot_date);

CREATE INDEX idx_bookings_writer_upcoming ON bookings(writer_id, slot_date, status)
    WHERE status IN ('paid', 'approved', 'published');

CREATE INDEX idx_bookings_writer_availability ON bookings(writer_id, slot_date)
    WHERE status NOT IN ('rejected', 'cancelled', 'refunded');

CREATE INDEX idx_bookings_lemon_order ON bookings(lemon_order_id)
    WHERE lemon_order_id IS NOT NULL;

CREATE INDEX idx_blackout_dates_writer ON blackout_dates(writer_id, blocked_date);

CREATE INDEX idx_payouts_writer_id ON payouts(writer_id);
CREATE INDEX idx_payouts_status ON payouts(status);


CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER writers_updated_at
    BEFORE UPDATE ON writers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sponsors_updated_at
    BEFORE UPDATE ON sponsors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
