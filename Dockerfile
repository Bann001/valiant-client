# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy env.sh script
COPY env.sh /docker-entrypoint.d/40-env.sh

# Make env.sh executable
RUN chmod +x /docker-entrypoint.d/40-env.sh

# Create .env file directory
RUN mkdir -p /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Use the default nginx Docker entrypoint which will run our env.sh script
CMD ["nginx", "-g", "daemon off;"] 