FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Delete package-lock.json if it exists and run a fresh install
RUN rm -f package-lock.json && npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 