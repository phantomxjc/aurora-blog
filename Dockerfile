FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY proxy.js ./
EXPOSE 8080
CMD ["node", "proxy.js"]
