const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env file
const authRoutes = require('./src/api/auth'); // Import auth routes
const { swaggerDocs } = require('./src/config/swaggerConfig'); // Import Swagger configuration

const app = express();
const port = process.env.PORT || 3000; // Use port from environment variable or default to 3000

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use authentication routes
app.use('/api/auth', authRoutes);

// Setup Swagger documentation
swaggerDocs(app, port);

// A simple route to check if the server is running
app.get('/', (req, res) => {
  res.status(200).send('Server is running and ready to receive requests!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

module.exports = app;