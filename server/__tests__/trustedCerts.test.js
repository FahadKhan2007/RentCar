import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { getTrustedCaList } from '../trustedCerts.js';
import { createEmailTransporter } from '../emailService.js';

describe('Trusted CA Certificates and Secure TLS Configuration', () => {
  it('loads a robust trusted CA list including Mozilla and OS-trusted root CAs', () => {
    const caList = getTrustedCaList();
    expect(Array.isArray(caList)).toBe(true);
    expect(caList.length).toBeGreaterThanOrEqual(100);

    // Verify each item is a valid PEM certificate and parseable X.509
    const sample = caList.slice(0, 5);
    for (const pem of sample) {
      expect(pem).toContain('-----BEGIN CERTIFICATE-----');
      expect(pem).toContain('-----END CERTIFICATE-----');
      const cert = new crypto.X509Certificate(pem);
      expect(cert.subject).toBeDefined();
    }
  }, 15000);

  it('creates email transporter with strict TLS certificate verification and STARTTLS', () => {
    const transporter = createEmailTransporter();
    const options = transporter.options;

    expect(options.host).toBe('smtp.gmail.com');
    expect(options.port).toBe(587);
    expect(options.secure).toBe(false);
    expect(options.requireTLS).toBe(true);

    // CRITICAL: Ensure rejectUnauthorized is strictly true
    expect(options.tls).toBeDefined();
    expect(options.tls.rejectUnauthorized).toBe(true);
    expect(options.tls.servername).toBe('smtp.gmail.com');
    expect(options.tls.minVersion).toBe('TLSv1.2');

    // Ensure CA list is attached
    expect(Array.isArray(options.tls.ca)).toBe(true);
    expect(options.tls.ca.length).toBeGreaterThanOrEqual(100);
  });
});
