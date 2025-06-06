import helmet from 'helmet';

// Configuración básica de Helmet
export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"]
    }
  },
  
  frameguard: { action: 'deny' },
  noSniff: true,
  // Forzar HTTPS en producción
  hsts: {
    maxAge: 31536000, // 1 año
    includeSubDomains: true,
    preload: true
  },
  hidePoweredBy: true,
  referrerPolicy: { policy: "no-referrer" }
});

// Versión simplificada para desarrollo
export const basicSecurity = helmet({
  contentSecurityPolicy: false, 
  hsts: false 
});