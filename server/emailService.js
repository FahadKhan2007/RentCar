import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generatePromoEmail } from './emailTemplate.js';
import { getTrustedCaList } from './trustedCerts.js';

dotenv.config();

/**
 * Checks if the SMTP configuration is set to real values rather than default placeholders.
 *
 * @returns {{ configured: boolean, reason?: string }}
 */
export const checkSmtpConfig = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return {
      configured: false,
      reason: 'SMTP_USER or SMTP_PASS environment variable is missing.',
    };
  }

  if (
    user.includes('your-email') ||
    pass.includes('your-16-character') ||
    pass === 'password'
  ) {
    return {
      configured: false,
      reason:
        'SMTP credentials are still using default placeholders. Please update SMTP_USER and SMTP_PASS in your .env file.',
    };
  }

  return { configured: true };
};

/**
 * Creates a configured Nodemailer transporter instance using Gmail standard STARTTLS on port 587.
 * Strictly verifies TLS certificates using Mozilla root CAs and OS-trusted root CAs (e.g. Avast/corporate shields).
 * Never disables TLS verification (`rejectUnauthorized: true`).
 *
 * @param {Object} [overrides]
 * @returns {nodemailer.Transporter}
 */
export const createEmailTransporter = (overrides = {}) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const isImplicitTls = process.env.SMTP_SECURE === 'true' || port === 465;

  const trustedCAs = getTrustedCaList();

  return nodemailer.createTransport({
    host,
    port,
    secure: isImplicitTls,
    requireTLS: !isImplicitTls, // Force STARTTLS when using port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // STRICT CERTIFICATE VERIFICATION ENABLED - Never set to false!
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
      servername: host,
      ca: trustedCAs,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    ...overrides,
  });
};

/**
 * Verifies the SMTP connection using transporter.verify().
 *
 * @param {nodemailer.Transporter} [transporter]
 * @returns {Promise<{ verified: boolean, host: string, port: number }>}
 */
export const verifySmtpConnection = async (transporter) => {
  const t = transporter || createEmailTransporter();
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  try {
    await t.verify();
    return {
      verified: true,
      host,
      port,
    };
  } catch (err) {
    console.error('[RentCar SMTP] Connection verification failed:', {
      host,
      port,
      code: err.code,
      command: err.command,
      responseCode: err.responseCode,
      message: err.message,
    });
    throw new Error(`SMTP connection verification failed: ${err.message}`, {
      cause: err,
    });
  }
};

/**
 * Sends the 10% promo code email to the specified recipient.
 *
 * @param {string} recipientEmail
 * @param {Object} [options]
 * @param {nodemailer.Transporter} [options.customTransporter] - For testing mocks
 * @param {boolean} [options.allowTestFallback] - Whether to allow Ethereal test SMTP fallback
 * @param {boolean} [options.skipVerify] - Whether to skip pre-send verification
 * @returns {Promise<{ success: boolean, messageId: string, previewUrl?: string, isTestAccount?: boolean }>}
 */
export const sendPromoCodeEmail = async (recipientEmail, options = {}) => {
  const configCheck = checkSmtpConfig();
  let transporter;
  let isTestAccount = false;
  let previewUrl = null;

  if (options.customTransporter) {
    transporter = options.customTransporter;
  } else if (configCheck.configured) {
    transporter = createEmailTransporter();
    // Test the SMTP connection using transporter.verify() before sending
    if (!options.skipVerify) {
      try {
        await transporter.verify();
      } catch (verifyErr) {
        console.error('[RentCar SMTP] Pre-send transporter.verify() failed:', {
          code: verifyErr.code,
          message: verifyErr.message,
        });
        throw new Error(
          `SMTP service connection failed: ${verifyErr.message || 'Verification failed'}`,
          { cause: verifyErr }
        );
      }
    }
  } else {
    // In automated test runs (Vitest), report unconfigured SMTP error unless explicitly overridden
    if (process.env.NODE_ENV === 'test' && !options.allowTestFallback) {
      throw new Error(`Email delivery failed: ${configCheck.reason}`);
    }

    // In development / live testing when SMTP is not configured:
    // Create an ephemeral Ethereal test account so real SMTP dispatch succeeds out of the box!
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        tls: {
          rejectUnauthorized: true,
          ca: getTrustedCaList(),
        },
      });
      isTestAccount = true;
    } catch (etherealErr) {
      throw new Error(
        `Email delivery failed: ${configCheck.reason || etherealErr.message}`,
        { cause: etherealErr }
      );
    }
  }

  const promoCode = process.env.PROMO_CODE || 'Niazi804';
  const discountPercent = parseInt(process.env.DISCOUNT_PERCENT || '10', 10);
  const fromAddress =
    process.env.SMTP_FROM ||
    `"CARRENT Official" <${process.env.SMTP_USER || 'no-reply@carrent.com'}>`;

  const { subject, text, html } = generatePromoEmail({
    promoCode,
    discountPercent,
    recipientEmail,
    siteUrl: process.env.SITE_URL || 'http://localhost:5173',
  });

  const mailOptions = {
    from: fromAddress,
    to: recipientEmail.trim(),
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (isTestAccount) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[RentCar Email] Promo code email sent via Ethereal test SMTP.`);
      console.log(`[RentCar Email] Preview URL: ${previewUrl}`);
    }
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      previewUrl: previewUrl || null,
      isTestAccount,
    };
  } catch (err) {
    console.error('[RentCar Email] Nodemailer transmission error:', {
      code: err.code,
      message: err.message,
      command: err.command,
    });
    throw new Error(
      `Email delivery failed: ${err.message || 'The mail server rejected the transmission.'}`,
      { cause: err }
    );
  }
};
