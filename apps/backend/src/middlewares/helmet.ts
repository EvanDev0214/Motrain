import helmet from 'helmet';

// Pure API server returns JSON only — CSP and COEP protect HTML pages, not API responses
const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
});

export default helmetMiddleware;
