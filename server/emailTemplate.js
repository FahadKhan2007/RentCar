/**
 * Professional HTML & Text Email Templates for RentCar Promo Code Delivery
 */

export const generatePromoEmail = ({
  promoCode = 'Niazi804',
  discountPercent = 10,
  recipientEmail = '',
  siteUrl = 'http://localhost:5173',
}) => {
  const subject = `🚗 Your ${discountPercent}% OFF RentCar Promo Code: ${promoCode}`;

  const text = `
Hello,

Thank you for choosing CARRENT!

Here is your exclusive ${discountPercent}% OFF promo code:
PROMO CODE: ${promoCode}

How to use your promo code:
1. Visit CARRENT and browse our fleet of vehicles.
2. Select your pickup and return dates on the Booking page.
3. In the Rental Summary section, enter promo code "${promoCode}" and click Apply.
4. Your ${discountPercent}% discount will be deducted automatically from your total rental price.

Book now: ${siteUrl}/booking

Need assistance? Contact our 24/7 customer support team at support@carrent.com.

Safe travels,
The CARRENT Team
© ${new Date().getFullYear()} CARRENT. All rights reserved.
`.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #030712; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header / Brand -->
          <tr>
            <td style="background-color: #000000; padding: 28px 32px; border-bottom: 2px solid #dc2626; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 2px; color: #ffffff;">
                CAR<span style="color: #dc2626;">RENT</span>
              </h1>
              <p style="margin: 6px 0 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px;">
                Premium Car Rental Service
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <!-- Headline Badge -->
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="display: inline-block; background-color: rgba(220, 38, 38, 0.15); color: #ef4444; border: 1px solid rgba(220, 38, 38, 0.3); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; rounded: 9999px; border-radius: 20px;">
                  Special Promotion Unlocked
                </span>
              </div>

              <h2 style="margin: 0 0 12px; font-size: 24px; font-weight: 800; color: #ffffff; text-align: center; line-height: 1.3;">
                Here Is Your <span style="color: #dc2626;">${discountPercent}% OFF</span> Promo Code!
              </h2>

              <p style="margin: 0 0 24px; font-size: 14px; color: #d1d5db; line-height: 1.6; text-align: center;">
                Thank you for your interest in CARRENT. Use your personalized promo code below to enjoy instant savings on your next luxury or economy vehicle rental.
              </p>

              <!-- Promo Code Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <div style="background-color: #030712; border: 2px dashed #dc2626; border-radius: 12px; padding: 20px 24px; max-width: 380px;">
                      <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                        Your Exclusive Promo Code
                      </div>
                      <div style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; color: #ef4444; letter-spacing: 3px;">
                        ${promoCode}
                      </div>
                      <div style="font-size: 12px; color: #10b981; margin-top: 6px; font-weight: 600;">
                        ✓ Valid for 10% OFF on all vehicles
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Step-by-Step Instructions -->
              <div style="background-color: #1f2937; border-radius: 12px; padding: 22px 24px; margin-bottom: 28px;">
                <h3 style="margin: 0 0 14px; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
                  How to Redeem Your Discount:
                </h3>
                <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #d1d5db; line-height: 1.8;">
                  <li>Visit our website and browse through our fleet of comfortable and luxury cars.</li>
                  <li>Go to the <b>Booking</b> page and choose your pickup and return dates.</li>
                  <li>In the <b>Rental Summary</b> card, type <strong style="color: #ffffff;">${promoCode}</strong> into the promo code box and click <b>Apply</b>.</li>
                  <li>Your 10% discount will be applied immediately to your total rental price!</li>
                </ol>
              </div>

              <!-- Call to Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/booking" target="_blank" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 36px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.4);">
                      Book Your Car Now →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 12px; color: #6b7280; text-align: center; line-height: 1.5;">
                This email was sent to <span style="color: #9ca3af;">${recipientEmail}</span> because you requested a discount code on CARRENT.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #030712; padding: 20px 32px; border-top: 1px solid #1f2937; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af;">
                Need help? Contact us anytime at <a href="mailto:support@carrent.com" style="color: #ef4444; text-decoration: none;">support@carrent.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #6b7280;">
                © ${new Date().getFullYear()} CARRENT. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

  return { subject, text, html };
};

