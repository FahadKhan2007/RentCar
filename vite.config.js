import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { processPromoRequest } from './server/promoHandler.js'
import { verifySmtpConnection } from './server/emailService.js'

function emailApiPlugin() {
  return {
    name: 'email-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Strip query parameters for routing
        const urlPath = req.url ? req.url.split('?')[0] : '';

        if (urlPath === '/api/send-promo' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = bodyStr ? JSON.parse(bodyStr) : {};
              const clientIp =
                req.headers['x-forwarded-for'] ||
                req.socket?.remoteAddress ||
                '127.0.0.1';

              const result = await processPromoRequest({
                email: parsed.email,
                clientIp,
              });

              res.statusCode = result.statusCode;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.body));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: err.message || 'Internal server error',
                })
              );
            }
          });
        } else if (urlPath === '/api/health' && req.method === 'GET') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'ok',
              environment: 'vite-dev',
              service: 'RentCar Email API',
            })
          );
        } else if (urlPath === '/api/verify-smtp' && req.method === 'GET') {
          try {
            const result = await verifySmtpConnection();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                message: 'SMTP connection verified successfully.',
                ...result,
              })
            );
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                error: err.message || 'SMTP connection verification failed',
              })
            );
          }
        } else {
          next();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), emailApiPlugin()],
  server: {
    port: 5173,
  },
})
