import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { promoExpressHandler } from './promoHandler.js';
import { verifySmtpConnection } from './emailService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RentCar Promo Code Email API',
    timestamp: new Date().toISOString(),
  });
});

// Diagnostic endpoint to verify SMTP connection & TLS handshake
app.get('/api/verify-smtp', async (req, res) => {
  try {
    const result = await verifySmtpConnection();
    res.json({
      success: true,
      message: 'SMTP connection verified successfully.',
      ...result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Promo Code Email Delivery Endpoint
app.post('/api/send-promo', promoExpressHandler);

// In production, serve static files from Vite build output if present
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚗 RentCar Email API Server running on port ${PORT}`);
  });
}

export default app;

