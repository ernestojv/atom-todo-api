# 🌐 Atom TODO API - Backend Challenge Técnico

![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)
![Express](https://img.shields.io/badge/Express-4.19-black?style=for-the-badge&logo=express)
![Firebase](https://img.shields.io/badge/Firebase-Functions-orange?style=for-the-badge&logo=firebase)
![Firestore](https://img.shields.io/badge/Firestore-Database-yellow?style=for-the-badge&logo=firebase)

## 📋 Descripción

**Atom TODO API** es el backend del challenge técnico FullStack Developer de **Atom**. Una API REST robusta y escalable desarrollada con Express.js, TypeScript y desplegada en Google Cloud Functions con Firebase Firestore como base de datos.

### 🌐 **API en Vivo**
🔗 **[API Base URL](https://us-central1-ernestojv-atom-todo.cloudfunctions.net/api)**

---

## ✨ Características Implementadas

### 🎯 **Funcionalidades Core**
- ✅ **Autenticación JWT** con email único
- ✅ **Creación automática de usuarios** si no existen
- ✅ **CRUD completo de tareas** (Create, Read, Update, Delete)
- ✅ **Validación de propiedad** de tareas por usuario
- ✅ **Estados de tareas** con timestamps
- ✅ **API RESTful** siguiendo mejores prácticas

### 🏗️ **Arquitectura y Patrones Backend**
- ✅ **Arquitectura hexagonal** con separación de capas
- ✅ **Principios SOLID** aplicados
- ✅ **Domain Driven Design (DDD)** con repositories
- ✅ **Factory pattern** para servicios
- ✅ **Singleton pattern** para configuraciones
- ✅ **Middleware pattern** para validaciones
- ✅ **Error handling** centralizado

### 🔒 **Seguridad y Validación**
- ✅ **JWT Authentication** con verificación de tokens
- ✅ **CORS** configurado apropiadamente
- ✅ **Helmet.js** para headers de seguridad
- ✅ **Rate limiting** para prevenir abuso
- ✅ **Validación de esquemas** con Joi
- ✅ **Middleware de validación** de propiedad de recursos
- ✅ **Manejo seguro de secrets** en Cloud Functions

### ⚡ **Optimizaciones y Performance**
- ✅ **Cloud Functions v2** para escalabilidad automática
- ✅ **Firestore** optimizado con índices
- ✅ **Conexión persistente** a base de datos
- ✅ **Lazy initialization** de servicios
- ✅ **Error handling** eficiente
- ✅ **Logging** estructurado

---

## 🛠️ Tecnologías Utilizadas

### **Backend Core**
- **Node.js 20** - Runtime JavaScript
- **Express.js 4.19** - Framework web
- **TypeScript 5.8** - Lenguaje tipado
- **Firebase Functions v2** - Serverless computing
- **Firestore** - Base de datos NoSQL

### **Seguridad & Middleware**
- **JWT (jsonwebtoken)** - Autenticación
- **Helmet.js** - Headers de seguridad
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting
- **Joi** - Validación de esquemas

### **DevOps & Tools**
- **GitHub Actions** - CI/CD automático
- **Firebase CLI** - Deployment tools
- **ESLint** - Linting de código
- **Firebase Admin SDK** - Interacción con Firebase

---

## 📡 Endpoints de la API

### **🔐 Autenticación**
```http
POST   /api/auth/login        # Iniciar sesión (crea usuario si no existe)
POST   /api/auth/verify       # Verificar token JWT
POST   /api/auth/refresh      # Renovar token JWT
POST   /api/auth/logout       # Cerrar sesión
```

### **✅ Gestión de Tareas**
```http
GET    /api/task              # Obtener todas las tareas del usuario (?userEmail=)
POST   /api/task              # Crear nueva tarea
GET    /api/task/:id          # Obtener tarea específica
PUT    /api/task/:id          # Actualizar tarea completa
DELETE /api/task/:id          # Eliminar tarea
GET    /api/task/stats        # Obtener estadísticas de tareas (?userEmail=)

# Estados de tareas
PATCH  /api/task/:id/in-progress  # Mover a "En Progreso"
PATCH  /api/task/:id/done         # Marcar como "Completada"
PATCH  /api/task/:id/todo         # Regresar a "Por Hacer"
```

### **👤 Gestión de Usuarios**
```http
POST   /api/user              # Crear nuevo usuario
GET    /api/user/check        # Verificar si usuario existe (?email=)
GET    /api/user/email/:email # Obtener usuario por email
GET    /api/user/:id          # Obtener usuario por ID
PUT    /api/user/:id          # Actualizar usuario
DELETE /api/user/:id          # Eliminar usuario
GET    /api/user/all          # Obtener todos los usuarios
GET    /api/user/stats        # Obtener estadísticas de usuarios

# Estados de usuario
PATCH  /api/user/:id/activate     # Activar usuario
PATCH  /api/user/:id/deactivate   # Desactivar usuario
```

---

## 🚀 Inicio Rápido

### **📋 Prerequisitos**
```bash
# Node.js 20+ requerido
node --version  # v20.x.x
npm --version   # 10.x.x

# Firebase CLI
npm install -g firebase-tools
```

### **⚡ Instalación Local**
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/atom-todo-api.git
cd atom-todo-api

# 2. Ir a la carpeta functions
cd functions

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
firebase functions:secrets:set JWT_SECRET

# 5. Ejecutar en desarrollo (emulador)
npm run serve
```

### 🔧 Variables de Entorno
```bash
# Secrets de Firebase Functions
firebase functions:secrets:set JWT_SECRET
firebase functions:secrets:set NODE_ENV

# Variables no sensibles (functions/.env.yaml)
JWT_EXPIRES_IN: "24h"
NODE_ENV: "production"
```

---

## 📱 Scripts Disponibles

```bash
# Desarrollo
npm run serve            # Emulador local de Firebase Functions
npm run shell            # Shell interactivo de Functions

# Build
npm run build            # Compilar TypeScript
npm run build:watch      # Compilar en modo watch

# Deploy
npm run deploy           # Deploy a Firebase Functions
firebase deploy --only functions

# Linting
npm run lint             # Verificar código con ESLint
npm run lint:fix         # Corregir problemas automáticamente

# Logs
npm run logs             # Ver logs de Cloud Functions
firebase functions:log
```

---

## 🚀 Despliegue

### **🔄 CI/CD Automático**
El proyecto incluye pipeline automático con **GitHub Actions**:

1. **Push a `main`** → Deploy automático a Cloud Functions
2. **Build TypeScript** → Compilación automática
3. **Configuración de secrets** → Variables de entorno seguras
4. **Deploy optimizado** para producción

### **📦 Deploy Manual**
```bash
# Build del proyecto
npm run build

# Deploy con Firebase CLI
firebase deploy --only functions

# Deploy con configuración específica
firebase deploy --only functions --project=tu-project-id
```

### **🌐 URLs de Deploy**
- **Producción**: https://us-central1-ernestojv-atom-todo.cloudfunctions.net/api

---

## 🛡️ Características de Seguridad

- ✅ **JWT Authentication** con verificación automática
- ✅ **Middleware de validación** de propiedad de recursos
- ✅ **Rate limiting** para prevenir ataques
- ✅ **CORS** configurado específicamente
- ✅ **Helmet.js** para headers de seguridad
- ✅ **Validación de entrada** con Joi schemas
- ✅ **Secrets management** con Firebase Functions v2
- ✅ **Error handling** sin exposición de información sensible

---

## 📊 Performance y Escalabilidad

### **Optimizaciones Implementadas**
- ✅ **Cloud Functions v2** para auto-scaling
- ✅ **Firestore** con índices optimizados
- ✅ **Lazy initialization** de servicios costosos
- ✅ **Connection pooling** automático
- ✅ **Caching** de configuraciones
- ✅ **Efficient querying** con filtros Firestore

### **Monitoreo**
- ✅ **Firebase Functions logs** integrados
- ✅ **Error tracking** con stack traces
- ✅ **Performance monitoring** automático
- ✅ **Cold start optimization**

---

## 🔧 Configuración Firebase

### **Inicialización**
```bash
# Inicializar proyecto Firebase
firebase init functions

# Configurar proyecto
firebase use --add tu-project-id

# Configurar secrets
firebase functions:secrets:set JWT_SECRET
```

---

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests de integración
npm run test:integration

# Linting de tests
npm run lint:test
```


