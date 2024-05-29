const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Medical App API',
            version: '1.0.0',
            description: 'API documentation for the Medical App handling user authentication and management',
        },
        components: {
            securitySchemes: {
              bearerAuth: {
                type: "http",
                scheme: "bearer",
                description: "Enter JWT Bearer token **_only_**"
              }
        }},
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local server'
            },
        ],
    },
    apis: ['./src/api/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
}

module.exports = { swaggerDocs };
