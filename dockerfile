# ==========================================
# ETAP 1: Budowanie Reacta (CRA + Tailwind)
# ==========================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app

# Kopiowanie pakietów i instalacja zależności frontendu
COPY package*.json ./
RUN npm ci

COPY index.html tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts ./
COPY public/ ./public
COPY src/ ./src

RUN npm run build

# # ==========================================
# # ETAP 2: Przygotowanie Parse Server (Backend)
# # ==========================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --only=production

# # ==========================================
# # ETAP 3: Obraz Produkcyjny dla Parse Server
# # ==========================================
FROM node:20-alpine AS parse-server
WORKDIR /app/server

COPY --from=backend-builder /app/server/node_modules ./node_modules
COPY server/ ./

EXPOSE 1337
CMD ["node", "index.js"]

# ==========================================
# ETAP 4: Obraz Produkcyjny dla Nginx (Frontend + Proxy SSL)
# ==========================================
FROM nginx:alpine AS frontend-nginx

COPY --from=frontend-builder /app/dist /usr/share/nginx/html

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]