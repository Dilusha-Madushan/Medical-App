const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const authRoutes = require('./src/api/auth');
const adminRoutes = require('./src/api/admin');
const patientRoutes = require('./src/api/patient');
const doctorRoutes = require('./src/api/doctor');
const { swaggerDocs } = require('./src/config/swaggerConfig'); // Import Swagger configuration

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000'
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);

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