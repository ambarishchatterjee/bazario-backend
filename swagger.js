// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Multi-Vendor E-commerce API",
      version: "1.0.0",
      description: "API documentation for Multi-Vendor platform",
    },
    servers: [
      {
        url: "https://bazario-backend-vmlz.onrender.com/api", // Update when deployed
      },
    ],
  },
  components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  apis: ["./routes/*.js"], // Path to your route files with Swagger annotations
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger docs available at https://bazario-backend-vmlz.onrender.com/api-docs");
}

module.exports = swaggerDocs;
