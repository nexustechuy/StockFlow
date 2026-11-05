FROM node:22-bookworm-slim

WORKDIR /app/backend

# Copia de archivos de dependencias
COPY backend/package*.json ./

# Instalacion de dependencias de producción
RUN npm ci --omit=dev

# Copir el backend
COPY backend/ ./

# Copiar archivos del frontend
COPY paginas/ /app/paginas/
COPY css/ /app/css/
COPY js/ /app/js/

# Puerto que utiliza Express
EXPOSE 3000

# Iniciar StockFlow
CMD ["node", "server.js"]
