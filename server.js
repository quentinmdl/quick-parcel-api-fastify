// Initialize & Configure Server
const fastify = require("fastify")({logger: true});

// Require modules
const path = require('node:path');
require('dotenv').config()

// Register fastify module
fastify.register(require('@fastify/formbody'))
fastify.register(require('@fastify/helmet'), {
   contentSecurityPolicy: false 
});
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'

});

// Initialize & Configure MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL).then(
  console.log('Database connected')
).catch(err => console.log(err));

// Import index
// const index = fs.createReadStream(path('./public/index.html'))

// Import Controllers
const entityRoutes = require("./routes/entityRoutes");

// Configure Routes
fastify.get("/", function (req, res) {
  res.raw.setHeader("Content-Type", "text/html");
  res.sendFile("index.html");
});

// Initiate routes from controller(s)
fastify.register(entityRoutes, { prefix: "/api/entity"});

// Listening 
const start = async () => {
  try {
    await fastify.listen(process.env.PORT);
    console.log("Server running");
    console.log(fastify.printRoutes());
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();