import cors from 'cors';

const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Lista de dominios permitidos
    const allowedOrigins = [
      'https://ernestojv-atom-todo.web.app',
      'https://ernestojv-atom-todo.firebaseapp.com',
    ];
    
    // Permitir requests sin origin (Postman, apps móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} no permitido por CORS`));
    }
  },
  
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Access-Control-Allow-Credentials'
  ],
  
  credentials: true,
  
  // Preflight cache
  maxAge: 86400,
  
  // Importante para preflight
  preflightContinue: false,
  optionsSuccessStatus: 200
};

export const corsMiddleware = cors(corsOptions);