# Service-oriented-architecture

Initialize a New Node.js Project
npm init -y

Most Node.js apps use a web framework like Express to handle HTTP requests. Install it with:
npm install express

To download all the dependencies listed in your package.json file, run the following command:
npm install

To start your Node.js application, run:
node server.js

You should see:
Server is running on http://localhost:3000


Add Nodemon for Auto-Restart
To avoid restarting the server manually, install nodemon:

npm install -g nodemon

Run the server with:
nodemon server.js