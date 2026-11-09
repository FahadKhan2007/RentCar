import { checkRateLimit } from './rateLimiter.js';
import { sendPromoCodeEmail } from './emailService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Core handler logic for processing promo code email requests.
 * Compatible with Express routes, Vite middleware, and serverless functions.
 *
 * @param {Object} params
 * @param {string} params.email - Recipient email
 * @param {string} params.clientIp - Client IP address
 * @param {Object} [params.options] - Service options (e.g. customTransporter)
 * @returns {Promise<{ statusCode: number, body: { success: boolean, message?: string, error?: string } }>}
 */
export const processPromoRequest = async ({ email, clientIp, options = {} }) => {
  // 1. Validate Email Input
  if (!email || typeof email !== 'string' || !email.trim()) {
    return {
      statusCode: 400,
      body: {
        success: false,
        error: 'Please enter your email address.',
      },
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(cleanEmail)) {
    return {
      statusCode: 400,
      body: {
        success: false,
        error: 'Please provide a valid email address (e.g. name@example.com).',
      },
    };
  }

  // 2. Check Rate Limits (both by IP and by recipient email)
  const ipCheck = checkRateLimit(`ip:${clientIp || 'unknown'}`);
  if (!ipCheck.allowed) {
    return {
      statusCode: 429,
      body: {
        success: false,
        error: `Too many requests from this device. Please wait ${ipCheck.retryAfterSeconds} seconds before trying again.`,
      },
    };
  }

  const emailCheck = checkRateLimit(`email:${cleanEmail}`);
  if (!emailCheck.allowed) {
    return {
      statusCode: 429,
      body: {
        success: false,
        error: `Too many requests for this email address. Please wait ${emailCheck.retryAfterSeconds} seconds before requesting another code.`,
      },
    };
  }

  // 3. Dispatch Email via Nodemailer
  try {
    const result = await sendPromoCodeEmail(cleanEmail, options);
    return {
      statusCode: 200,
      body: {
        success: true,
        message: `Promo code successfully sent to ${cleanEmail}! Please check your inbox and spam folder.`,
        messageId: result.messageId,
        previewUrl: result.previewUrl || null,
        isTestAccount: Boolean(result.isTestAccount),
      },
    };
  } catch (err) {
    const rawError = err.message || '';
    let userFriendlyError;

    if (
      rawError.includes('EAUTH') ||
      rawError.includes('Username and Password not accepted') ||
      rawError.includes('BadCredentials')
    ) {
      userFriendlyError =
        'Email service authentication failed. Please check your SMTP configuration in .env.';
    } else if (
      rawError.includes('self-signed certificate') ||
      rawError.includes('SELF_SIGNED_CERT_IN_CHAIN')
    ) {
      userFriendlyError =
        'TLS certificate verification failed. Please check your network security or antivirus settings.';
    } else if (
      rawError.includes('ECONNECTION') ||
      rawError.includes('ETIMEDOUT') ||
      rawError.includes('ENOTFOUND')
    ) {
      userFriendlyError =
        'Unable to connect to the mail server. Please verify your network connection.';
    } else {
      userFriendlyError = rawError || 'Failed to deliver email. Please try again later.';
    }

    return {
      statusCode: 500,
      body: {
        success: false,
        error: userFriendlyError,
      },
    };
  }
};

/**
 * Express middleware handler
 */
export const promoExpressHandler = async (req, res) => {
  const email = req.body?.email;
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const response = await processPromoRequest({ email, clientIp });
  return res.status(response.statusCode).json(response.body);
};

