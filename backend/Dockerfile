FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar código fuente
COPY src/ ./src/

# Puerto de la aplicación
EXPOSE 3000

# Comando de inicio
CMD ["node", "src/index.js"]