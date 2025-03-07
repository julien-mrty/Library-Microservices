FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY prisma/ ./prisma/
RUN npx prisma generate   
COPY . .
CMD ["node", "server.js"]
EXPOSE 3000