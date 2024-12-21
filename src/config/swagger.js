const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

function setupSwagger(app) {
  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'API documentation for the URL Shortener service'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer'
        }
      }
    },
    paths: {
      '/api/shorten': {
        post: {
          tags: ['URL'],
          summary: 'Create a short URL',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['longUrl'],
                  properties: {
                    longUrl: {
                      type: 'string',
                      format: 'uri'
                    },
                    customAlias: {
                      type: 'string'
                    },
                    topic: {
                      type: 'string',
                      enum: ['acquisition', 'activation', 'retention']
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Short URL created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      shortUrl: {
                        type: 'string'
                      },
                      createdAt: {
                        type: 'string',
                        format: 'date-time'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/analytics/url/{alias}': {
        get: {
          tags: ['Analytics'],
          summary: 'Get URL analytics',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'alias',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            200: {
              description: 'Analytics data retrieved successfully'
            }
          }
        }
      }
    }
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = { setupSwagger };