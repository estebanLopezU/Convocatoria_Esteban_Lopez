# 🚀 Ejecución del Proyecto - Sistema de Homogenización Climática

## 📋 Requisitos Previos
- Docker Desktop 24.0+
- Docker Compose 2.20+

## 🔧 Pasos de Ejecución (Docker - Recomendado)

```bash
# 1. Clonar repositorio
git clone https://github.com/estebanLopezU/Convocatoria_Esteban_Lopez.git
cd Convocatoria_Esteban_Lopez

# 2. Levantar los contenedores
docker-compose up -d --build

# 3. Verificar servicios
docker-compose ps

# 4. Acceder al sistema
# Frontend: http://localhost:8081
# Backend API: http://localhost:3002
# Health Check: http://localhost:3002/api/health
```

## 🛑 Detener el Sistema
```bash
docker-compose down
```

## 💻 Ejecución Local (sin Docker)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## 🌐 URLs Finales (Docker)
| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:8081 |
| Backend API | http://localhost:3002 |
| MongoDB | localhost:27017 |

## 📁 Archivos Principales
- `docker-compose.yml` - Orquestación de contenedores
- `backend/src/services/homogenizer.js` - Algoritmo de interpolación
- `frontend/src/App.jsx` - Interfaz principal
- `data/ejemplo_estacion.json` - Datos de ejemplo

## ✅ Verificación
```bash
# Probar algoritmo
node test_algoritmo.js
```