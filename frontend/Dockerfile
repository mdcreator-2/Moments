# ─── Stage 1: Build ───
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: Serve ───
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx template (uses $PORT variable)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Railway provides PORT env var; default to 80 for local Docker
ENV PORT=80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
