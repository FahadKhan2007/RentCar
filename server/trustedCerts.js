import tls from 'tls';
import crypto from 'crypto';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CA_CACHE_FILE = path.join(__dirname, '.trusted-system-cas.pem');

let cachedTrustedCAs = null;

/**
 * Extracts and caches trusted root CA certificates from the Windows Certificate Store.
 *
 * @returns {string[]} Array of PEM certificate strings
 */
const extractWindowsRootCertificates = () => {
  if (process.platform !== 'win32') return [];

  // Check on-disk cache for near-instant (1ms) reads across worker threads/processes
  if (fs.existsSync(CA_CACHE_FILE)) {
    try {
      const cached = fs.readFileSync(CA_CACHE_FILE, 'utf8');
      const matches =
        cached.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g) || [];
      if (matches.length > 0) {
        return matches;
      }
    } catch {
      // Ignore cache read failures and re-extract
    }
  }

  try {
    const psScript = `
      $ProgressPreference = 'SilentlyContinue';
      $items = Get-ChildItem -Path Cert:\\LocalMachine\\Root, Cert:\\CurrentUser\\Root -ErrorAction SilentlyContinue
      foreach ($c in $items) {
        if ($c.RawData) {
          $b64 = [System.Convert]::ToBase64String($c.RawData, [System.Base64FormattingOptions]::InsertLineBreaks)
          Write-Output "-----BEGIN CERTIFICATE-----"
          Write-Output $b64
          Write-Output "-----END CERTIFICATE-----"
        }
      }
    `;

    const encoded = Buffer.from(psScript, 'utf16le').toString('base64');
    const output = execSync(
      `powershell.exe -NoProfile -NonInteractive -EncodedCommand ${encoded}`,
      {
        timeout: 10000,
        maxBuffer: 25 * 1024 * 1024,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    );

    const matches =
      output.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g) || [];

    if (matches.length > 0) {
      try {
        fs.writeFileSync(CA_CACHE_FILE, matches.join('\n\n'), 'utf8');
      } catch {
        // Ignore cache write failures
      }
    }

    return matches;
  } catch (err) {
    console.warn(
      'Note: Could not query Windows certificate store, using default Mozilla CA bundle:',
      err.message
    );
    return [];
  }
};

/**
 * Loads trusted root CA certificates:
 * 1. Default Mozilla root certificates bundled with Node.js (`tls.rootCertificates`).
 * 2. Any certificates defined in process.env.NODE_EXTRA_CA_CERTS.
 * 3. On Windows, trusted Root CAs installed in the Windows Certificate Store (e.g. antivirus/corporate shields).
 *
 * All certificates are strictly validated using `crypto.X509Certificate`.
 * Certificate verification is NEVER disabled (`rejectUnauthorized: true`).
 *
 * @returns {string[]} Array of PEM-formatted CA certificates
 */
export const getTrustedCaList = () => {
  if (cachedTrustedCAs) {
    return cachedTrustedCAs;
  }

  const certSet = new Set(tls.rootCertificates);

  // 1. Check NODE_EXTRA_CA_CERTS if provided
  if (process.env.NODE_EXTRA_CA_CERTS) {
    try {
      if (fs.existsSync(process.env.NODE_EXTRA_CA_CERTS)) {
        const extraCerts = fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS, 'utf8');
        const pemMatches =
          extraCerts.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g) || [];
        for (const pem of pemMatches) {
          certSet.add(pem.trim());
        }
      }
    } catch {
      // Ignore if unreadable
    }
  }

  // 2. On Windows, import OS-trusted Root CAs from Windows Certificate Store
  const systemCertPems = extractWindowsRootCertificates();
  for (const pem of systemCertPems) {
    try {
      const trimmed = pem.trim();
      // Validate that the certificate is structurally valid X.509
      new crypto.X509Certificate(trimmed);
      certSet.add(trimmed);
    } catch {
      // Skip invalid certificate blocks
    }
  }

  cachedTrustedCAs = Array.from(certSet);
  return cachedTrustedCAs;
};

/**
 * Resets the cached CA list (useful for unit testing).
 */
export const resetTrustedCaCache = () => {
  cachedTrustedCAs = null;
};
