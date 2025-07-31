import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Status Tracker API',
      version: '1.0.0',
      description: 'A comprehensive API for managing support and development tickets with automated status progression',
      contact: {
        name: 'API Support',
        email: 'support@tickettracker.com'
      }
    },
    servers: [
      {
        url: 'https://ticket-status-tracker.onrender.com/api',
        description: 'Production server'
      },
      {
        url: 'http://localhost:5001/api',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Ticket: {
          type: 'object',
          required: ['title', 'description', 'owner'],
          properties: {
            _id: {
              type: 'string',
              description: 'Ticket ID'
            },
            title: {
              type: 'string',
              description: 'Ticket title'
            },
            description: {
              type: 'string',
              description: 'Ticket description'
            },
            status: {
              type: 'string',
              enum: ['Open', 'In Progress', 'Review', 'Testing', 'Done'],
              default: 'Open',
              description: 'Current ticket status'
            },
            owner: {
              $ref: '#/components/schemas/User'
            },
            history: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['Open', 'In Progress', 'Review', 'Testing', 'Done']
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };