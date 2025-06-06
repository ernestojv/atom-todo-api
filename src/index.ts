import express, { Request, Response } from 'express';
import { firestore } from './config/firestore';

import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandler } from './middleware/error.middleware';
import { generalRateLimit } from './middleware/rateLimit.middleware';
import { basicSecurity } from './middleware/helmet.middleware';

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

// Ruta adicional
app.get('/api/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: 'Welcome to the Atom TODO API',
    timestamp: new Date().toISOString()
  });
});


// Ruta para probar Firestore
app.get('/test-firestore', async (req, res) => {
  try {
    // Crear documento de prueba
    const testDoc = await firestore.collection('test').add({
      message: 'Hello Firestore!',
      timestamp: new Date()
    });

    res.json({
      success: true,
      docId: testDoc.id
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Error connecting to Firestore',
      details: error.message
    });
  }
});

app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server is running http://localhost:${PORT}`);
});