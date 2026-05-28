#  Sistema de Homogenización Climática

**Prueba Técnica SAT** — Convocatoria Esteban López

Sistema profesional para transformar datos de estaciones meteorológicas con base de tiempo no uniforme a datos **cincominutales** (cada 5 minutos) mediante reglas de interpolación lineal.

---

##  Descripción

El algoritmo implementa las siguientes reglas de decisión para asignar cada dato cincominutal:

| Dato anterior     | Dato siguiente      | Acción                  |
|-------------------|---------------------|-------------------------|
| < 5 min           | < 5 min             | Interpolación lineal    |
| < 2.5 min         | No hay (> 5 min)    | Tomar dato anterior     |
| No hay (> 5 min)  | < 2.5 min           | Tomar dato siguiente    |
| > 2.5 min         | No hay (> 5 min)    | ND                      |
| No hay (> 5 min)  | > 2.5 min           | ND                      |

##  Arquitectura

```
├── backend/                 # API REST (Node.js + Express)
│   ├── src/
│   │   ├── index.js         # Servidor Express
│   │   ├── routes/          # Rutas de la API
│   │   ├── services/        # Algoritmo de interpolación
│   │   └── models/          # Modelo MongoDB
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                # UI (React + Vite)
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   └── services/        # Cliente API
│   ├── Dockerfile
│   ├── nginx.conf           # Configuración Nginx
│   └── package.json
│
├── data/
│   └── ejemplo_estacion.json # Datos sintéticos de ejemplo
│
├── docker-compose.yml       # Orquestación de contenedores
└── README.md
```

## Tecnologías Elegidas

| Capa           | Tecnología                          | Razón                                         |
|----------------|-------------------------------------|---------------------------------------------|
| **Backend**    | Node.js + Express                   | Alto rendimiento I/O, ideal para APIs REST  |
| **Frontend**   | React + Vite + Chart.js             | Reactividad, gráficas interactivas           |
| **Base datos** | MongoDB                             | Flexibilidad de esquema para datos climáticos|
| **Proxy**      | Nginx                               | Servidor web rápido, proxy inverso           |
| **Docker**     | Docker Compose                      | Orquestación simple de 3 contenedores          |

## Instalación y Ejecución

### Usando Docker (recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/estebanLopezU/Convocatoria_Esteban_Lopez.git
cd Convocatoria_Esteban_Lopez

# Construir y levantar los contenedores
docker-compose up -d --build

# Verificar que los servicios estén corriendo
docker-compose ps
```

- **Frontend:** http://localhost:8081
- **Backend API:** http://localhost:3002
- **Health Check:** http://localhost:3002/api/health

### Desarrollo local (sin Docker)

#### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Iniciar servidor (requiere MongoDB en local)
npm start

# O con nodemon para desarrollo
npm run dev
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend en modo desarrollo corre en http://localhost:5174 (con proxy al backend).

## 📡 Endpoints de la API

### `POST /api/homogenize`

Homogeniza datos crudos a formato cincominutal.

**Body:**
```json
{
  "stationName": "Nombre de la estación (opcional)",
  "data": [
    {
      "fecha": "11/5/2015",
      "hora": "19:36:21",
      "temp": 16.17,
      "vel_viento": 0,
      "dir_viento": 0,
      "dir_rosa": "S",
      "presion": 594.36,
      "humedad": 94,
      "ppt_cincom": 6.6,
      "rad_solar": 0,
      "evt_cincom": 1.83
    }
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "processingTimeMs": 2,
  "summary": {
    "inputRecords": 8,
    "outputRecords": 8,
    "stationName": "Estación Central"
  },
  "inputData": [...],
  "outputData": [...]
}
```

### `GET /api/history`

Obtiene el historial de cálculos realizados.

**Parámetros query:**
- `limit` (default: 10) — Número de registros por página
- `page` (default: 1) — Número de página

### `GET /api/history/:id`

Obtiene un cálculo específico con todos los detalles.

### `GET /api/health`

Health check del servicio.

## Algoritmo de Interpolación Lineal

La interpolación lineal se realiza mediante la fórmula:

```
f(t) = v₁ + ((t - t₁) / (t₂ - t₁)) × (v₂ - v₁)
```

Donde:
- `t`: fecha objetivo (tiempo cincominutal)
- `t₁`: fecha anterior
- `t₂`: fecha posterior
- `v₁`: valor asociado a la fecha anterior
- `v₂`: valor asociado a la fecha posterior
- `f(t)`: valor interpolado para la fecha objetivo

## Contacto

- **Correos de envío:** ndduqueme@unal.edu.co, avargase@unal.edu.co
- **Repositorio:** [https://github.com/estebanLopezU/Convocatoria_Esteban_Lopez](https://github.com/estebanLopezU/Convocatoria_Esteban_Lopez)

## Licencia

Prueba técnica — Convocatoria SAT 2026
