import express, { Request, Response } from 'express';

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server is running http://localhost:${PORT}`);
});