import cors from 'cors';

const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Lista de dominios permitidos
    const allowedOrigins = [
      'https://ernestojv-atom-todo.web.app.com/',
      'https://ernestojv-atom-todo.web.app.com',
    ];
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} no permitido por CORS`));
    }
  },
  
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  
  credentials: true,
  
  maxAge: 86400
};

export const corsMiddleware = cors(corsOptions);