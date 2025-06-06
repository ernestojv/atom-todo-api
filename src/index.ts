import express, { Request, Response } from 'express';
import { firestore } from './config/firestore';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server is running http://localhost:${PORT}`);
});