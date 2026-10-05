FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
EXPOSE 3002
CMD ["sh", "-c", "npx prisma db push && npx tsx scripts/seed.ts && npx tsx src/main.ts"]
