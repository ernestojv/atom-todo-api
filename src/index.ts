import express, { Request, Response } from 'express';

import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandler } from './middleware/error.middleware';
import { generalRateLimit } from './middleware/rateLimit.middleware';
import { basicSecurity } from './middleware/helmet.middleware';

import { routerApi } from './routes/index.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(basicSecurity);
app.use(generalRateLimit);
app.use(express.json());

// Ruta Hello World
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello Atom TODO Api!',
    timestamp: new Date().toISOString()
  });
});

routerApi(app);

app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server is running http://localhost:${PORT}`);
});