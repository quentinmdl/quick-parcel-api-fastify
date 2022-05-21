// Initialize & Configure Server
const fastify = require("fastify")({logger: true});
const path = require('node:path');

// Require modules
const fs = require('fs');

// Register fastify module
fastify.register(require('@fastify/formbody'))
fastify.register(require('@fastify/helmet'), {
   contentSecurityPolicy: false 
});
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'

});

// Custom port
const PORT = 8101;

// Initialize & Configure MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@main.doxhq.mongodb.net/festival-api?retryWrites=true&w=majority').then(
  console.log('Database connected')
).catch(err => console.log(err));

// Import index
// const index = fs.createReadStream(path('./public/index.html'))

// Import Controllers
const festivalRoutes = require("./routes/festivalRoutes");

// Configure Routes
fastify.get("/", function (req, res) {
  res.raw.setHeader("Content-Type", "text/html");
  res.sendFile("index.html");
});

// Initiate routes from controller(s)
fastify.register(festivalRoutes, { prefix: "/api/festival"});

// Listening 
const start = async () => {
  try {
    await fastify.listen(PORT);
    console.log("Server running");
    console.log(fastify.printRoutes());
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();