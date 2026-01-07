use super::types::*;

pub(super) struct EmailTemplate;

impl EmailTemplate {
    pub fn base(content: &str, preheader: &str) -> String {
        format!(
            r##"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Adsloty</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a2e;
            background-color: #f8fafc;
            -webkit-font-smoothing: antialiased;
        }}
        .preheader {{
            display: none !important;
            visibility: hidden;
            opacity: 0;
            color: transparent;
            height: 0;
            width: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            mso-hide: all;
        }}
        .email-wrapper {{
            width: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
        }}
        .email-container {{
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }}
        .email-header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 32px 40px;
            text-align: center;
        }}
        .logo {{
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            text-decoration: none;
            letter-spacing: -0.5px;
        }}
        .logo-dot {{
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #fbbf24;
            border-radius: 50%;
            margin-left: 2px;
            vertical-align: super;
        }}
        .email-body {{
            padding: 40px;
        }}
        .greeting {{
            font-size: 14px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }}
        .headline {{
            font-size: 28px;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 24px;
            line-height: 1.3;
        }}
        .text {{
            font-size: 16px;
            color: #475569;
            margin-bottom: 24px;
            line-height: 1.7;
        }}
        .highlight-box {{
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 4px solid #667eea;
            border-radius: 8px;
            padding: 24px;
            margin: 24px 0;
        }}
        .highlight-box.success {{
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-left-color: #22c55e;
        }}
        .highlight-box.warning {{
            background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
            border-left-color: #f59e0b;
        }}
        .highlight-box.error {{
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border-left-color: #ef4444;
        }}
        .detail-grid {{
            display: table;
            width: 100%;
            margin: 16px 0;
        }}
        .detail-row {{
            display: table-row;
        }}
        .detail-label {{
            display: table-cell;
            padding: 8px 16px 8px 0;
            font-size: 14px;
            color: #64748b;
            white-space: nowrap;
        }}
        .detail-value {{
            display: table-cell;
            padding: 8px 0;
            font-size: 14px;
            font-weight: 600;
            color: #1a1a2e;
        }}
        .ad-preview {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
        }}
        .ad-preview-label {{
            font-size: 12px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }}
        .ad-headline {{
            font-size: 18px;
            font-weight: 600;
            color: #1a1a2e;
            margin-bottom: 8px;
        }}
        .ad-body {{
            font-size: 14px;
            color: #64748b;
            margin-bottom: 12px;
        }}
        .ad-cta {{
            display: inline-block;
            font-size: 14px;
            color: #667eea;
            font-weight: 600;
            text-decoration: none;
        }}
        .btn {{
            display: inline-block;
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.2s;
            text-align: center;
        }}
        .btn-primary {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
        }}
        .btn-secondary {{
            background: #f1f5f9;
            color: #475569 !important;
        }}
        .btn-success {{
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: #ffffff !important;
        }}
        .btn-wrapper {{
            text-align: center;
            margin: 32px 0;
        }}
        .divider {{
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 32px 0;
        }}
        .stats-grid {{
            display: table;
            width: 100%;
            margin: 24px 0;
        }}
        .stat-item {{
            display: table-cell;
            text-align: center;
            padding: 16px;
            border-right: 1px solid #e2e8f0;
        }}
        .stat-item:last-child {{
            border-right: none;
        }}
        .stat-value {{
            font-size: 28px;
            font-weight: 700;
            color: #667eea;
            display: block;
        }}
        .stat-label {{
            font-size: 12px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 4px;
        }}
        .email-footer {{
            background: #f8fafc;
            padding: 32px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }}
        .footer-text {{
            font-size: 14px;
            color: #94a3b8;
            margin-bottom: 16px;
        }}
        .footer-links {{
            margin-bottom: 16px;
        }}
        .footer-links a {{
            color: #64748b;
            text-decoration: none;
            margin: 0 12px;
            font-size: 14px;
        }}
        .footer-brand {{
            font-size: 12px;
            color: #cbd5e1;
        }}

        .badge {{
            display: inline-block;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 100px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .badge-success {{
            background: #dcfce7;
            color: #16a34a;
        }}
        .badge-warning {{
            background: #fef3c7;
            color: #d97706;
        }}
        .badge-info {{
            background: #e0f2fe;
            color: #0284c7;
        }}
        @media only screen and (max-width: 600px) {{
            .email-wrapper {{
                padding: 20px 10px;
            }}
            .email-body {{
                padding: 24px;
            }}
            .email-header {{
                padding: 24px;
            }}
            .headline {{
                font-size: 24px;
            }}
            .btn {{
                display: block;
                width: 100%;
            }}
            .stat-item {{
                display: block;
                border-right: none;
                border-bottom: 1px solid #e2e8f0;
                padding: 12px;
            }}
            .stat-item:last-child {{
                border-bottom: none;
            }}
        }}
    </style>
</head>
<body>
    <div class="preheader">{preheader}</div>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="email-header">
                <a href="https://adsloty.com" class="logo">adsloty<span class="logo-dot"></span></a>
            </div>
            <div class="email-body">
                {content}
            </div>
            <div class="email-footer">
                <div class="footer-links">
                    <a href="https://adsloty.com/dashboard">Dashboard</a>
                    <a href="https://adsloty.com/help">Help Center</a>
                    <a href="https://adsloty.com/settings">Settings</a>
                </div>
                <p class="footer-text">
                    You're receiving this email because you have an account on Adsloty.
                </p>
                <p class="footer-brand">
                    Adsloty Inc. - Newsletter Advertising Made Simple
                </p>
            </div>
        </div>
    </div>
</body>
</html>
"##,
            content = content,
            preheader = preheader
        )
    }

    pub fn booking_confirmation(data: &BookingConfirmationData) -> String {
        let amount = format!("{:.2}", data.amount_cents as f64 / 100.0);
        let currency = data.currency.to_uppercase();
        let ad_cta_text = data.ad_cta_text.as_deref().unwrap_or("Learn More");
        let content = format!(
            r##"
<p class="greeting">Booking Confirmed</p>
<h1 class="headline">Your ad slot is reserved!</h1>
<p class="text">
    Great news! Your ad placement with <strong>{newsletter_name}</strong> has been successfully booked
    and payment received. The newsletter owner will review your ad content shortly.
</p>

<div class="highlight-box">
    <div class="detail-grid">
        <div class="detail-row">
            <span class="detail-label">Newsletter</span>
            <span class="detail-value">{newsletter_name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Publish Date</span>
            <span class="detail-value">{slot_date}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Amount Paid</span>
            <span class="detail-value">${amount} {currency}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value"><span class="badge badge-warning">Pending Review</span></span>
        </div>
    </div>
</div>

<div class="ad-preview">
    <p class="ad-preview-label">Your Ad Preview</p>
    <h3 class="ad-headline">{ad_headline}</h3>
    <p class="ad-body">{ad_body}</p>
    <a href="{ad_cta_url}" class="ad-cta">{ad_cta_text} →</a>
</div>

<div class="btn-wrapper">
    <a href="{dashboard_url}" class="btn btn-primary">View Booking Details</a>
</div>

<div class="divider"></div>

<p class="text" style="font-size: 14px; color: #94a3b8;">
    <strong>What's next?</strong> The newsletter owner will review your ad and either approve it
    or request changes. You'll receive an email notification once your ad is approved.
</p>
"##,
            newsletter_name = data.newsletter_name,
            slot_date = data.slot_date,
            amount = amount,
            currency = currency,
            ad_headline = data.ad_headline,
            ad_body = data.ad_body,
            ad_cta_text = ad_cta_text,
            ad_cta_url = data.ad_cta_url,
            dashboard_url = data.dashboard_url
        );

        Self::base(&content, "Your ad slot has been booked successfully!")
    }

    pub fn new_booking_notification(data: &NewBookingNotificationData) -> String {
        let payout = format!("{:.2}", data.writer_payout_cents as f64 / 100.0);
        let ad_cta_text = data.ad_cta_text.as_deref().unwrap_or("Learn More");
        let company_website = data.company_website.as_deref().unwrap_or("-");
        let content = format!(
            r##"
<p class="greeting">New Booking</p>
<h1 class="headline">You have a new sponsor!</h1>
<p class="text">
    <strong>{sponsor_name}</strong> just booked an ad slot in your newsletter.
    Review the ad content below and approve or reject it.
</p>

<div class="stats-grid">
    <div class="stat-item">
        <span class="stat-value">${payout}</span>
        <span class="stat-label">Your Payout</span>
    </div>
    <div class="stat-item">
        <span class="stat-value">{slot_date}</span>
        <span class="stat-label">Publish Date</span>
    </div>
</div>

<div class="ad-preview">
    <p class="ad-preview-label">Ad Content to Review</p>
    <h3 class="ad-headline">{ad_headline}</h3>
    <p class="ad-body">{ad_body}</p>
    <a href="{ad_cta_url}" class="ad-cta">{ad_cta_text} →</a>
</div>

<div class="highlight-box">
    <div class="detail-grid">
        <div class="detail-row">
            <span class="detail-label">Sponsor</span>
            <span class="detail-value">{sponsor_name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Company</span>
            <span class="detail-value">{company_website}</span>
        </div>
    </div>
</div>

<div class="btn-wrapper">
    <a href="{dashboard_url}" class="btn btn-success">Review & Approve</a>
</div>

<div class="divider"></div>

<p class="text" style="font-size: 14px; color: #94a3b8;">
    <strong>Reminder:</strong> Please review this booking within 48 hours.
    If you don't take action, the sponsor may request a refund.
</p>
"##,
            sponsor_name = data.sponsor_name,
            payout = payout,
            slot_date = data.slot_date,
            ad_headline = data.ad_headline,
            ad_body = data.ad_body,
            ad_cta_text = ad_cta_text,
            ad_cta_url = data.ad_cta_url,
            company_website = company_website,
            dashboard_url = data.dashboard_url
        );

        let preheader = format!("{} just booked an ad slot!", data.sponsor_name);
        Self::base(&content, &preheader)
    }

    pub fn booking_approved(data: &BookingStatusData) -> String {
        let content = format!(
            r##"
<p class="greeting">Approved</p>
<h1 class="headline">Your ad has been approved!</h1>
<p class="text">
    Great news! The owner of <strong>{newsletter_name}</strong> has approved your ad.
    Your ad will be published on <strong>{slot_date}</strong>.
</p>

<div class="highlight-box success">
    <div class="detail-grid">
        <div class="detail-row">
            <span class="detail-label">Newsletter</span>
            <span class="detail-value">{newsletter_name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Publish Date</span>
            <span class="detail-value">{slot_date}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value"><span class="badge badge-success">Approved</span></span>
        </div>
    </div>
</div>

<p class="text">
    We'll send you another notification when your ad goes live. Get ready for some great results!
</p>

<div class="btn-wrapper">
    <a href="{dashboard_url}" class="btn btn-primary">View Campaign</a>
</div>
"##,
            newsletter_name = data.newsletter_name,
            slot_date = data.slot_date,
            dashboard_url = data.dashboard_url
        );

        Self::base(
            &content,
            "Your ad has been approved and will be published soon!",
        )
    }

    pub fn booking_rejected(data: &BookingRejectedData) -> String {
        let reason_section = if let Some(reason) = &data.reason {
            format!(
                r##"
<div class="highlight-box warning">
    <p style="font-weight: 600; margin-bottom: 8px;">Reason provided:</p>
    <p style="color: #64748b;">{}</p>
</div>
"##,
                reason
            )
        } else {
            String::new()
        };

        let amount = format!("{:.2}", data.amount_cents as f64 / 100.0);
        let currency = data.currency.to_uppercase();
        let content = format!(
            r##"
<p class="greeting">Booking Update</p>
<h1 class="headline">Your ad was not approved</h1>
<p class="text">
    Unfortunately, the owner of <strong>{newsletter_name}</strong> was unable to approve
    your ad for the <strong>{slot_date}</strong> slot.
</p>

{reason_section}

<div class="highlight-box">
    <div class="detail-grid">
        <div class="detail-row">
            <span class="detail-label">Refund Status</span>
            <span class="detail-value"><span class="badge badge-info">Processing</span></span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Amount</span>
            <span class="detail-value">${amount} {currency}</span>
        </div>
    </div>
</div>

<p class="text">
    A full refund has been initiated. Please allow 5-10 business days for the funds to appear
    in your account, depending on your payment method.
</p>

<div class="btn-wrapper">
    <a href="https://adsloty.com/discover" class="btn btn-primary">Browse Other Newsletters</a>
</div>

<div class="divider"></div>

<p class="text" style="font-size: 14px; color: #94a3b8;">
    Don't be discouraged! Every newsletter has different content guidelines.
    Try exploring other newsletters that might be a better fit for your brand.
</p>
"##,
            newsletter_name = data.newsletter_name,
            slot_date = data.slot_date,
            reason_section = reason_section,
            amount = amount,
            currency = currency
        );

        Self::base(
            &content,
            "Your booking was not approved. A refund is on its way.",
        )
    }

    pub fn booking_published(data: &BookingPublishedData) -> String {
        let content = format!(
            r##"
<p class="greeting">Live Now</p>
<h1 class="headline">Your ad is live!</h1>
<p class="text">
    Exciting news! Your ad in <strong>{newsletter_name}</strong> has just been published
    and is now reaching {subscriber_count} subscribers!
</p>

<div class="stats-grid">
    <div class="stat-item">
        <span class="stat-value">{subscriber_count}</span>
        <span class="stat-label">Subscribers Reached</span>
    </div>
    <div class="stat-item">
        <span class="stat-value">{slot_date}</span>
        <span class="stat-label">Publish Date</span>
    </div>
</div>

<div class="ad-preview">
    <p class="ad-preview-label">Your Published Ad</p>
    <h3 class="ad-headline">{ad_headline}</h3>
    <p class="ad-body">{ad_body}</p>
    <a href="{ad_cta_url}" class="ad-cta">{ad_cta_text} →</a>
</div>

<div class="btn-wrapper">
    <a href="{dashboard_url}" class="btn btn-success">View Campaign Results</a>
</div>

<div class="divider"></div>

<p class="text" style="font-size: 14px; color: #94a3b8;">
    <strong>Pro tip:</strong> Monitor your website analytics to track the performance
    of this campaign. Consider booking again if you see good results!
</p>
"##,
            newsletter_name = data.newsletter_name,
            subscriber_count = data
                .subscriber_count
                .map(|c| format!("{}", c))
                .unwrap_or_else(|| "thousands of".to_string()),
            slot_date = data.slot_date,
            ad_headline = data.ad_headline,
            ad_body = data.ad_body,
            ad_cta_text = data.ad_cta_text.as_deref().unwrap_or("Learn More"),
            ad_cta_url = data.ad_cta_url,
            dashboard_url = data.dashboard_url
        );

        Self::base(&content, "Your ad is now live and reaching subscribers!")
    }

    pub fn payout_notification(data: &PayoutNotificationData) -> String {
        let amount = format!("{:.2}", data.amount_cents as f64 / 100.0);
        let currency = data.currency.to_uppercase();
        let content = format!(
            r##"
<p class="greeting">Payout Initiated</p>
<h1 class="headline">Money is on the way!</h1>
<p class="text">
    Great news! We've initiated a payout for your completed bookings.
    The funds should arrive in your bank account soon.
</p>

<div class="stats-grid">
    <div class="stat-item">
        <span class="stat-value">${amount}</span>
        <span class="stat-label">Payout Amount</span>
    </div>
    <div class="stat-item">
        <span class="stat-value">{booking_count}</span>
        <span class="stat-label">Bookings</span>
    </div>
</div>

<div class="highlight-box success">
    <div class="detail-grid">
        <div class="detail-row">
            <span class="detail-label">Currency</span>
            <span class="detail-value">{currency}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Expected Arrival</span>
            <span class="detail-value">2-7 business days</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value"><span class="badge badge-success">Processing</span></span>
        </div>
    </div>
</div>

<div class="btn-wrapper">
    <a href="{dashboard_url}" class="btn btn-primary">View Payout Details</a>
</div>

<div class="divider"></div>

<p class="text" style="font-size: 14px; color: #94a3b8;">
    Thank you for being part of Adsloty! Keep creating great content and
    the bookings will keep coming.
</p>
"##,
            amount = amount,
            booking_count = data.booking_count,
            currency = currency,
            dashboard_url = data.dashboard_url
        );

        let preheader = format!("Your payout of ${} is on its way!", amount);
        Self::base(&content, &preheader)
    }

    pub fn password_reset(data: &PasswordResetData) -> String {
        let content = format!(
            r##"
<p class="greeting">Password Reset</p>
<h1 class="headline">Reset your password</h1>
<p class="text">
    We received a request to reset the password for your Adsloty account.
    Click the button below to create a new password.
</p>

<div class="btn-wrapper">
    <a href="{reset_url}" class="btn btn-primary">Reset Password</a>
</div>

<div class="highlight-box warning">
    <p style="font-size: 14px;">
        <strong>This link expires in 1 hour.</strong><br>
        If you didn't request this password reset, you can safely ignore this email.
        Your password will remain unchanged.
    </p>
</div>

<div class="divider"></div>

<p class="text" style="font-size: 14px; color: #94a3b8;">
    If the button doesn't work, copy and paste this link into your browser:<br>
    <span style="word-break: break-all; color: #667eea;">{reset_url}</span>
</p>
"##,
            reset_url = data.reset_url
        );

        Self::base(&content, "Reset your Adsloty password")
    }

    pub fn welcome(data: &WelcomeData) -> String {
        let role_content = if data.is_writer {
            r##"
<div class="highlight-box">
    <p style="font-weight: 600; margin-bottom: 12px;">Get started in 3 steps:</p>
    <ol style="margin: 0; padding-left: 20px; color: #64748b;">
        <li style="margin-bottom: 8px;">Complete your profile with newsletter details</li>
        <li style="margin-bottom: 8px;">Set your ad slot pricing and availability</li>
        <li style="margin-bottom: 8px;">Add the booking widget to your newsletter</li>
    </ol>
</div>

<p class="text">
    Once set up, sponsors can discover your newsletter and book ad slots instantly.
    You'll earn money while focusing on what you do best—creating great content.
</p>
"##
        } else {
            r##"
<div class="highlight-box">
    <p style="font-weight: 600; margin-bottom: 12px;">Get started in 3 steps:</p>
    <ol style="margin: 0; padding-left: 20px; color: #64748b;">
        <li style="margin-bottom: 8px;">Browse newsletters in your target niche</li>
        <li style="margin-bottom: 8px;">Book ad slots with instant self-service checkout</li>
        <li style="margin-bottom: 8px;">Track your campaigns from your dashboard</li>
    </ol>
</div>

<p class="text">
    Reach engaged audiences through trusted newsletter creators.
    No more back-and-forth emails—just pick a slot, create your ad, and go live.
</p>
"##
        };

        let content = format!(
            r##"
<p class="greeting">Welcome</p>
<h1 class="headline">Hey {name}, welcome to Adsloty!</h1>
<p class="text">
    We're thrilled to have you join the Adsloty community. You're now part of the
    easiest way to buy and sell newsletter advertising.
</p>

{role_content}

<div class="btn-wrapper">
    <a href="{dashboard_url}" class="btn btn-primary">Go to Dashboard</a>
</div>

<div class="divider"></div>

<p class="text" style="font-size: 14px; color: #94a3b8;">
    <strong>Need help?</strong> Reply to this email or visit our
    <a href="https://adsloty.com/help" style="color: #667eea;">Help Center</a>.
    We're here to help you succeed!
</p>
"##,
            name = data.name,
            role_content = role_content,
            dashboard_url = data.dashboard_url
        );

        Self::base(&content, &format!("Welcome to Adsloty, {}!", data.name))
    }
}
