FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY prisma/ ./prisma/
RUN npx prisma generate   
COPY . .
CMD ["sh", "-c", "until npx prisma migrate deploy; do sleep 2; done && node server.js"]
EXPOSE 3000