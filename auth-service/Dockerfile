# Utilise une image Node.js officielle (version 18 par exemple)
FROM node:18

# Crée un répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package*.json pour installer les dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code (auth-service.js, server.js, etc.)
COPY . .

# Expose le port (celui sur lequel l'app écoute, ex. 4000)
EXPOSE 4000

# Définit la commande de démarrage
CMD ["node", "server.js"]
