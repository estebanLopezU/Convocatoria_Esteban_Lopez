# Manual de Usuario - Sistema de Homogenizacion Climatica

## Version 1.0.0
## Prueba Tecnica SAT - Convocatoria Esteban Lopez

---

## Tabla de Contenidos

1. [Introduccion](#1-introduccion)
2. [Requisitos del Sistema](#2-requisitos-del-sistema)
3. [Instalacion y Configuracion](#3-instalacion-y-configuracion)
   - [3.1 Clonar el Repositorio](#31-clonar-el-repositorio)
   - [3.2 Ejecutar con Docker (Recomendado)](#32-ejecutar-con-docker-recomendado)
   - [3.3 Ejecutar sin Docker (Desarrollo Local)](#33-ejecutar-sin-docker-desarrollo-local)
4. [Estructura del Proyecto](#4-estructura-del-proyecto)
5. [Uso del Sistema](#5-uso-del-sistema)
   - [5.1 Acceder a la Aplicacion](#51-acceder-a-la-aplicacion)
   - [5.2 Preparar Archivo JSON de Datos](#52-preparar-archivo-json-de-datos)
   - [5.3 Cargar y Procesar Datos](#53-cargar-y-procesar-datos)
   - [5.4 Interpretar Resultados](#54-interpretar-resultados)
6. [API REST - Endpoints](#6-api-rest---endpoints)
   - [6.1 POST /api/homogenize](#61-post-apihomogenize)
   - [6.2 GET /api/history](#62-get-apihistory)
   - [6.3 GET /api/history/:id](#63-get-apihistoryid)
   - [6.4 GET /api/health](#64-get-apihealth)
7. [Algoritmo de Interpolacion](#7-algoritmo-de-interpolacion)
   - [7.1 Reglas de Decision](#71-reglas-de-decision)
   - [7.2 Formula de Interpolacion Lineal](#72-formula-de-interpolacion-lineal)
   - [7.3 Ejemplos de Calculo](#73-ejemplos-de-calculo)
8. [Formato de Datos](#8-formato-de-datos)
   - [8.1 Estructura del JSON de Entrada](#81-estructura-del-json-de-entrada)
   - [8.2 Ejemplo de Datos](#82-ejemplo-de-datos)
9. [Verificacion del Sistema](#9-verificacion-del-sistema)
10. [Solucion de Problemas](#10-solucion-de-problemas)

---

## 1. Introduccion

El Sistema de Homogenizacion Climatica es una aplicacion web profesional que permite transformar datos meteorologicos con intervalos de tiempo irregulares (no cincominutales) a intervalos regulares de 5 minutos (cincominutales) mediante un algoritmo de interpolacion lineal.

Este sistema fue desarrollado como parte de la prueba tecnica para la convocatoria SAT. Utiliza tecnologias modernas como Node.js, Express, React, MongoDB y Docker para ofrecer una solucion robusta y escalable.

### Funcionalidades Principales

- Carga de archivos JSON con datos meteorologicos de estaciones
- Procesamiento automatico mediante algoritmo de interpolacion con 5 reglas de decision
- Visualizacion de tabla comparativa (Dato Original vs Dato Cincominutal)
- Grafica interactiva de temperatura interpolada con Chart.js
- Historial persistente de calculos realizados
- Interfaz con escenarios climaticos animados (primavera, verano, otono, invierno)

---

## 2. Requisitos del Sistema

### Para ejecucion con Docker (recomendado)

| Software | Version minima |
|----------|---------------|
| Docker Engine | 24.0 o superior |
| Docker Compose | 2.20 o superior |
| Git | 2.30 o superior |
| RAM disponible | 2 GB |
| Espacio en disco | 1 GB |

### Para ejecucion sin Docker (desarrollo local)

| Software | Version minima |
|----------|---------------|
| Node.js | 18.0 o superior |
| npm | 9.0 o superior |
| MongoDB | 7.0 o superior |
| Git | 2.30 o superior |

### Sistemas Operativos Soportados

- Windows 10/11
- macOS 12 o superior
- Linux (Ubuntu 20.04+, Debian 11+, CentOS 8+)

---

## 3. Instalacion y Configuracion

### 3.1 Clonar el Repositorio

Abra una terminal y ejecute:

```bash
git clone https://github.com/estebanLopezU/Convocatoria_Esteban_Lopez.git
cd Convocatoria_Esteban_Lopez
```

### 3.2 Ejecutar con Docker (Recomendado)

**Paso 1:** Construir y levantar los contenedores

```bash
docker-compose up -d --build
```

Este comando construye las imagenes y levanta tres contenedores:
- frontend-container: Sirve la interfaz web con Nginx en el **puerto 8081**
- backend-container: Ejecuta la API REST en el **puerto 3002**
- db-container: Base de datos MongoDB en el puerto 27017

**Paso 2:** Verificar que los contenedores esten funcionando

```bash
docker-compose ps
```

Deberia ver los tres servicios con estado "Up".

**Paso 3:** Verificar el health check del backend

```bash
curl http://localhost:3002/api/health
```

Respuesta esperada:
```json
{"status":"ok","service":"Climatic Homogenization API","version":"1.0.0","timestamp":"2026-05-27T..."}
```

**Paso 4:** Detener los contenedores (cuando termine)

```bash
docker-compose down
```

Para detener y eliminar tambien los volumenes de datos:
```bash
docker-compose down -v
```

### 3.3 Ejecutar sin Docker (Desarrollo Local)

#### Backend

**Paso 1:** Navegar a la carpeta del backend

```bash
cd backend
```

**Paso 2:** Instalar dependencias

```bash
npm install
```

**Paso 3:** Configurar la conexion a MongoDB (opcional)

Por defecto, el backend intenta conectarse a MongoDB en `mongodb://localhost:27017/climatic_homogenization`. Si su MongoDB corre en otra direccion, configure la variable de entorno:

En Windows (CMD):
```cmd
set MONGO_URI=mongodb://localhost:27017/climatic_homogenization
```

En Linux/macOS:
```bash
export MONGO_URI=mongodb://localhost:27017/climatic_homogenization
```

**Paso 4:** Iniciar el servidor backend

```bash
npm start
```

El servidor se iniciara en http://localhost:3000.

Para desarrollo con recarga automatica (nodemon):
```bash
npm run dev
```

#### Frontend

**Paso 1:** Abrir una nueva terminal y navegar al frontend

```bash
cd frontend
```

**Paso 2:** Instalar dependencias

```bash
npm install
```

**Paso 3:** Iniciar el servidor de desarrollo

```bash
npm run dev
```

El frontend se iniciara en http://localhost:5174.

> Nota: El servidor de desarrollo de Vite tiene configurado un proxy que redirige las peticiones `/api/*` al backend en `http://localhost:3000`. Asegurese de que el backend este corriendo antes de usar el frontend.

---

## 4. Estructura del Proyecto

```
Convocatoria_Esteban_Lopez/
│
├── backend/                          # API REST (Node.js + Express)
│   ├── src/
│   │   ├── index.js                  # Servidor Express (punto de entrada)
│   │   ├── routes/
│   │   │   └── homogenize.routes.js  # Endpoints: POST /homogenize, GET /history
│   │   ├── services/
│   │   │   └── homogenizer.js        # Algoritmo de interpolacion
│   │   └── models/
│   │       └── history.js            # Modelo MongoDB para historial
│   ├── Dockerfile                    # Configuracion Docker del backend
│   └── package.json                  # Dependencias del backend
│
├── frontend/                         # Interfaz de usuario (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx                   # Componente principal
│   │   ├── App.css                   # Estilos del sistema (clima animado)
│   │   ├── main.jsx                  # Punto de entrada React
│   │   ├── components/
│   │   │   ├── DataUploader.jsx      # Carga de archivos JSON
│   │   │   ├── ComparisonTable.jsx   # Tabla comparativa profesional
│   │   │   ├── TemperatureChart.jsx  # Grafica Chart.js
│   │   │   └── History.jsx           # Historial de calculos
│   │   └── services/
│   │       └── api.js                # Cliente HTTP para API
│   ├── Dockerfile                    # Configuracion Docker (multi-stage)
│   ├── nginx.conf                    # Configuracion Nginx
│   ├── vite.config.js                # Configuracion Vite
│   └── package.json                  # Dependencias del frontend
│
├── data/
│   └── ejemplo_estacion.json         # Datos sinteticos de ejemplo
│
├── docker-compose.yml                # Orquestacion de 3 contenedores
├── MANUAL_DE_USUARIO.md              # Este manual
├── test_algoritmo.js                 # Prueba del algoritmo
└── README.md                         # Documentacion general
```

---

## 5. Uso del Sistema

### 5.1 Acceder a la Aplicacion

Una vez que el frontend este corriendo, abra su navegador web y vaya a:

- **Con Docker:** http://localhost:8081
- **Sin Docker:** http://localhost:5174

### 5.2 Preparar Archivo JSON de Datos

El sistema acepta archivos JSON con datos meteorologicos. Cada registro debe contener los siguientes campos:

```json
[
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
```

Puede usar el archivo de ejemplo incluido en `data/ejemplo_estacion.json` o crear su propio archivo siguiendo la misma estructura.

### 5.3 Cargar y Procesar Datos

**Paso 1:** Seleccione el tema de estacion (opcional)

En la parte superior de la pagina encontrara 5 botones para cambiar el fondo climatico:
- Automatico (transiciona entre las 4 estaciones)
- Primavera
- Verano
- Otono
- Invierno

**Paso 2:** Seleccione el archivo JSON

Haga clic en el area de carga (rectangulo punteado) y seleccione el archivo JSON. Tambien puede ingresar un nombre para la estacion en el campo de texto.

**Paso 3:** Procesar los datos

Haga clic en el boton "Procesar Datos". El sistema enviara los datos al backend, que aplicara el algoritmo de interpolacion y devolvera los resultados.

**Paso 4:** Visualizar los resultados

Una vez procesados, se mostraran:

1. **Resumen del Procesamiento:** Tarjetas con estadisticas (total registros, con datos, interpolados, ND).
2. **Curva de Temperatura Interpolada:** Grafica de linea que compara la temperatura original vs la cincominutal.
3. **Tabla Comparativa:** Tabla profesional con columnas de Original y Cincominutal para cada variable.
4. **Historial de Calculos:** Lista de calculos previos realizados (persistidos en MongoDB).

### 5.4 Interpretar Resultados

#### Tabla Comparativa

La tabla muestra para cada horario cincominutal (cada 5 minutos):

- **Original:** El valor mas cercano en los datos de entrada
- **Cincominutal:** El valor calculado por el algoritmo
- **Delta (min):** Diferencia en minutos entre el dato original y el horario objetivo
- **Estado:** Indicador visual del metodo utilizado:
  - "Exacto" (verde): Dato original a menos de 1 minuto
  - "Cercano" (turquesa): Dato original a menos de 2.5 minutos
  - "Interpolado" (naranja): Dato calculado por interpolacion lineal
  - "ND" (gris): No disponible

Puede hacer clic en cualquier fila para expandir un panel con el detalle completo de todas las variables.

#### Dashboard de Estadisticas

Arriba de la tabla se muestran 4 indicadores:
- Total Registros
- Con Datos (valores validos)
- Interpolados
- Sin Dato (ND)

---

## 6. API REST - Endpoints

### 6.1 POST /api/homogenize

Procesa datos crudos y devuelve el array homogeneizado a intervalo cincominutal.

**Request:**

```
POST http://localhost:3002/api/homogenize
Content-Type: application/json
```

**Body:**

```json
{
  "stationName": "Nombre de la estacion",
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

**Response (200):**

```json
{
  "success": true,
  "processingTimeMs": 2,
  "summary": {
    "inputRecords": 8,
    "outputRecords": 8,
    "stationName": "Estacion Central"
  },
  "inputData": [...],
  "outputData": [
    {
      "fecha": "11/5/2015",
      "hora": "19:35:00",
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

**Ejemplo con curl:**

```bash
curl -X POST http://localhost:3002/api/homogenize \
  -H "Content-Type: application/json" \
  -d @data/ejemplo_estacion.json
```

### 6.2 GET /api/history

Recupera el historial de calculos realizados.

**Request:**

```
GET http://localhost:3002/api/history?limit=10&page=1
```

**Parametros:**

| Parametro | Tipo | Default | Descripcion |
|-----------|------|---------|-------------|
| limit | number | 10 | Numero de registros por pagina |
| page | number | 1 | Numero de pagina |

**Response (200):**

```json
{
  "success": true,
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  },
  "records": [
    {
      "_id": "665abc...",
      "timestamp": "2026-05-27T19:30:00.000Z",
      "summary": {
        "totalInputRecords": 8,
        "totalOutputRecords": 8,
        "stationName": "Estacion Central"
      },
      "createdAt": "2026-05-27T19:30:00.000Z"
    }
  ]
}
```

### 6.3 GET /api/history/:id

Obtiene los detalles completos de un calculo especifico.

**Request:**

```
GET http://localhost:3002/api/history/665abc...
```

**Response (200):**

```json
{
  "success": true,
  "record": {
    "_id": "665abc...",
    "inputData": [...],
    "outputData": [...],
    "summary": {...}
  }
}
```

### 6.4 GET /api/health

Verifica que el servicio este funcionando.

**Request:**

```
GET http://localhost:3002/api/health
```

**Response (200):**

```json
{
  "status": "ok",
  "service": "Climatic Homogenization API",
  "version": "1.0.0",
  "timestamp": "2026-05-27T19:30:00.000Z"
}
```

---

## 7. Algoritmo de Interpolacion

### 7.1 Reglas de Decision

El algoritmo implementa las siguientes reglas para asignar cada dato cincominutal:

| Condicion del Dato Anterior | Condicion del Dato Siguiente | Accion |
|-----------------------------|------------------------------|--------|
| Existe a menos de 5 min | Existe a menos de 5 min | Interpolacion lineal |
| Existe a menos de 2.5 min | No existe (mas de 5 min) | Tomar el dato anterior |
| No existe (mas de 5 min) | Existe a menos de 2.5 min | Tomar el dato siguiente |
| Existe a mas de 2.5 min | No existe (mas de 5 min) | Colocar ND |
| No existe (mas de 5 min) | Existe a mas de 2.5 min | Colocar ND |

**Nota:** Si existe un registro pero todos sus campos son ND, se considera que no hay datos disponibles y se ignora.

### 7.2 Formula de Interpolacion Lineal

Cuando ambos intervalos (anterior y siguiente) contienen datos a menos de 5 minutos, se aplica interpolacion lineal:

```
f(t) = v1 + ((t - t1) / (t2 - t1)) * (v2 - v1)
```

Donde:
- t: Fecha objetivo (tiempo cincominutal)
- t1: Fecha del registro anterior
- t2: Fecha del registro posterior
- v1: Valor asociado a la fecha anterior
- v2: Valor asociado a la fecha posterior
- f(t): Valor interpolado para la fecha objetivo

### 7.3 Ejemplos de Calculo

**Ejemplo 1: Interpolacion lineal para las 19:40:00**

Datos disponibles:
- Anterior: 19:36:21 con temp = 16.17
- Posterior: 19:42:24 con temp = 16.11

Calculo:
- Diferencia total: 19:42:24 - 19:36:21 = 363 segundos
- Diferencia parcial: 19:40:00 - 19:36:21 = 219 segundos
- proporcion = 219 / 363 = 0.603
- temp = 16.17 + 0.603 * (16.11 - 16.17) = 16.17 - 0.036 = 16.13

**Ejemplo 2: Toma de dato anterior para las 19:45:00**

Datos disponibles:
- Anterior: 19:44:29 a 0.52 minutos (< 2.5 min)
- Posterior: No hay datos en el intervalo

Resultado: Se copia el valor del registro de las 19:44:29 (temp = 16.06)

**Ejemplo 3: Dato no disponible para las 20:00:00**

Datos disponibles:
- Anterior: 19:54:41 a 5.32 minutos (> 5 min)
- Posterior: Registro 20:00:12 existe pero todos los campos son ND

Resultado: ND (No Disponible)

**Ejemplo 4: Interpolacion circular para direccion del viento**

Para la direccion del viento (0-360 grados) se utiliza interpolacion circular que considera que 0 y 360 son equivalentes. Si la velocidad del viento es 0, la direccion se considera invalida (calma) y no se interpola.

---

## 8. Formato de Datos

### 8.1 Estructura del JSON de Entrada

El archivo JSON debe contener un array de objetos, donde cada objeto representa una medicion de la estacion:

```json
[
  {
    "fecha": "MM/DD/YYYY",
    "hora": "HH:mm:ss",
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
```

### Campos Requeridos

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| fecha | string | Fecha en formato MM/DD/YYYY |
| hora | string | Hora en formato HH:mm:ss |

### Campos de Variables

| Campo | Tipo | Unidad | Descripcion |
|-------|------|--------|-------------|
| temp | number | grados Celsius | Temperatura |
| vel_viento | number | m/s | Velocidad del viento |
| dir_viento | number | grados (0-360) | Direccion del viento |
| dir_rosa | string | - | Direccion de la rosa de los vientos (N, S, E, W, NE, NO, SE, SO, etc.) |
| presion | number | hPa | Presion atmosferica |
| humedad | number | % | Humedad relativa |
| ppt_cincom | number | mm | Precipitacion |
| rad_solar | number | W/m2 | Radiacion solar |
| evt_cincom | number | mm | Evapotranspiracion |

Si una variable no tiene dato, use el valor "ND" (string).

### 8.2 Ejemplo de Datos

El archivo `data/ejemplo_estacion.json` contiene los datos de las Tablas 1 y 2 del PDF:

```json
[
  { "fecha": "11/5/2015", "hora": "19:36:21", "temp": 16.17, "vel_viento": 0, "dir_viento": 0, "dir_rosa": "S", "presion": 594.36, "humedad": 94, "ppt_cincom": 6.6, "rad_solar": 0, "evt_cincom": 1.83 },
  { "fecha": "11/5/2015", "hora": "19:42:24", "temp": 16.11, "vel_viento": 0.89, "dir_viento": 165, "dir_rosa": "SSE", "presion": 594.44, "humedad": 94, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
  { "fecha": "11/5/2015", "hora": "19:44:29", "temp": 16.06, "vel_viento": 0, "dir_viento": 90, "dir_rosa": "E", "presion": 594.54, "humedad": 94, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
  { "fecha": "11/5/2015", "hora": "19:50:36", "temp": 15.89, "vel_viento": 0, "dir_viento": 83, "dir_rosa": "E", "presion": 594.67, "humedad": 93, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
  { "fecha": "11/5/2015", "hora": "19:54:41", "temp": 15.67, "vel_viento": 0, "dir_viento": 83, "dir_rosa": "E", "presion": 595.02, "humedad": 93, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
  { "fecha": "11/5/2015", "hora": "20:00:12", "temp": "ND", "vel_viento": "ND", "dir_viento": "ND", "dir_rosa": "ND", "presion": "ND", "humedad": "ND", "ppt_cincom": "ND", "rad_solar": "ND", "evt_cincom": "ND" },
  { "fecha": "11/5/2015", "hora": "20:05:54", "temp": 15.5, "vel_viento": 0, "dir_viento": 83, "dir_rosa": "E", "presion": 594.79, "humedad": 94, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 },
  { "fecha": "11/5/2015", "hora": "20:10:56", "temp": 15.39, "vel_viento": 0, "dir_viento": 83, "dir_rosa": "E", "presion": 594.92, "humedad": 94, "ppt_cincom": 0, "rad_solar": 0, "evt_cincom": 0 }
]
```

---

## 9. Verificacion del Sistema

### Prueba Rapida del Algoritmo

Para verificar que el algoritmo funciona correctamente con los datos del PDF:

```bash
node test_algoritmo.js
```

Este script ejecuta el algoritmo con los datos de la Tabla 1 del PDF y compara los resultados con la Tabla 2.

---

## 10. Solucion de Problemas

### Problema: El backend no inicia

**Sintoma:** `Error: connect ECONNREFUSED ::1:27017`

**Solucion:** Asegurese de que MongoDB este corriendo. Si no tiene MongoDB local, inicie el backend sin persistencia (funcionara igual pero sin guardar historial). Verifique tambien que no haya otro proceso usando el puerto 3000.

```bash
# Verificar que el puerto 3000 este libre (Windows)
netstat -ano | findstr :3000

# Matar proceso si es necesario (Windows)
taskkill /F /PID [PROCESS_ID]
```

### Problema: El frontend no carga

**Sintoma:** Pagina en blanco o error de conexion

**Solucion:**
1. Verifique que el backend este corriendo en `http://localhost:3000`
2. Verifique que el frontend este en `http://localhost:5173`
3. Revise la consola del navegador (F12) para ver errores especificos

### Problema: Error "port is already allocated" en Docker

**Sintoma:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solucion:** Otro proceso esta usando el puerto 3000. Detengalo o cambie el puerto en `docker-compose.yml`.

```bash
# Encontrar el proceso
netstat -ano | findstr :3000

# Matarlo
taskkill /F /PID [PID]
```

### Problema: Error "npm ci" en Docker

**Sintoma:** Error en la construccion de la imagen Docker

**Solucion:** El comando `npm ci` requiere un archivo `package-lock.json`. Si no existe, ejecute `npm install` localmente primero para generarlo, o modifique el Dockerfile para usar `npm install` en su lugar.

### Problema: El algoritmo no produce los resultados esperados

**Sintoma:** Los valores no coinciden con el PDF

**Solucion:** Ejecute la prueba del algoritmo para verificar:

```bash
node test_algoritmo.js
```

Si hay diferencias, revise que los datos de entrada tengan el formato correcto (fecha en MM/DD/YYYY, hora en HH:mm:ss).

### Problema: No se guarda el historial

**Sintoma:** GET /api/history devuelve array vacio

**Solucion:** Verifique que MongoDB este corriendo y accesible. Si no hay base de datos, el sistema funciona pero no persiste el historial. Revise los logs del backend para ver errores de conexion.

---

## Contacto

Para soporte o consultas sobre este sistema:

- **Correos de envio:** ndduqueme@unal.edu.co, avargase@unal.edu.co
- **Repositorio:** https://github.com/estebanLopezU/Convocatoria_Esteban_Lopez

---

*Documentacion generada para la Prueba Tecnica SAT - Convocatoria Esteban Lopez - 2025*