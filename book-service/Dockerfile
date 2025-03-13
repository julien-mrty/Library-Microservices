FROM node:18
WORKDIR /app
RUN apt-get update && apt-get install -y openssl
COPY package.json package-lock.json ./
RUN npm install prisma --save-dev
RUN npm install @prisma/client
RUN npm install
COPY prisma/ ./prisma/
RUN npx prisma generate   
COPY . .
CMD ["sh", "-c", "while ! npx prisma migrate deploy; do sleep 2; done && node server.js"]
EXPOSE 3001 