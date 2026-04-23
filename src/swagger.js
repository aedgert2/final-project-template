export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Character Creation API',
    version: '1.0.0',
    description:
      'REST API for creating and managing game characters. Users can build characters by selecting a class and equipping items from a shared catalog. Write operations on the catalog (Classes, Items) are restricted to admin users.',
  },
  servers: [{ url: '/api', description: 'API base path' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste your JWT token here (obtained from POST /auth/login)',
      },
    },
    schemas: {
      // ── Auth ──────────────────────────────────────────────────────────────
      SignupRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', example: 'newuser' },
          email: { type: 'string', format: 'email', example: 'newuser@example.com' },
          password: { type: 'string', format: 'password', example: 'MyPass123!' },
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 4 },
          username: { type: 'string', example: 'newuser' },
          email: { type: 'string', example: 'newuser@example.com' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'alice@example.com' },
          password: { type: 'string', format: 'password', example: 'User123!' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      // ── Character ─────────────────────────────────────────────────────────
      CreateCharacterRequest: {
        type: 'object',
        required: ['name', 'classId'],
        properties: {
          name: { type: 'string', example: 'Aragorn' },
          level: { type: 'integer', minimum: 1, default: 1, example: 1 },
          classId: { type: 'integer', example: 1 },
        },
      },
      UpdateCharacterRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Strider' },
          level: { type: 'integer', minimum: 1, example: 5 },
          classId: { type: 'integer', example: 2 },
        },
      },
      CharacterResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Aragorn' },
          level: { type: 'integer', example: 5 },
          classId: { type: 'integer', example: 1 },
          userId: { type: 'integer', example: 2 },
        },
      },
      CharacterWithItemsResponse: {
        allOf: [
          { $ref: '#/components/schemas/CharacterResponse' },
          {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    item: { $ref: '#/components/schemas/ItemResponse' },
                  },
                },
              },
            },
          },
        ],
      },
      AddItemRequest: {
        type: 'object',
        required: ['itemId'],
        properties: { itemId: { type: 'integer', example: 1 } },
      },
      CharacterItemResponse: {
        type: 'object',
        properties: {
          characterId: { type: 'integer', example: 1 },
          itemId: { type: 'integer', example: 1 },
        },
      },
      // ── Class ─────────────────────────────────────────────────────────────
      CreateClassRequest: {
        type: 'object',
        required: ['name', 'description'],
        properties: {
          name: { type: 'string', example: 'Druid' },
          description: { type: 'string', example: 'A nature-wielding shapeshifter.' },
        },
      },
      UpdateClassRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Berserker' },
          description: { type: 'string', example: 'An aggressive, rage-fueled melee fighter.' },
        },
      },
      ClassResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Warrior' },
          description: { type: 'string', example: 'A powerful melee fighter who excels in close combat.' },
        },
      },
      // ── Item ──────────────────────────────────────────────────────────────
      CreateItemRequest: {
        type: 'object',
        required: ['name', 'type', 'tier'],
        properties: {
          name: { type: 'string', example: 'Dragon Lance' },
          type: {
            type: 'string',
            enum: ['weapon', 'armor', 'spell', 'consumable', 'accessory'],
            example: 'weapon',
          },
          tier: { type: 'integer', minimum: 1, example: 3 },
        },
      },
      UpdateItemRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Steel Sword' },
          type: {
            type: 'string',
            enum: ['weapon', 'armor', 'spell', 'consumable', 'accessory'],
            example: 'weapon',
          },
          tier: { type: 'integer', minimum: 1, example: 2 },
        },
      },
      ItemResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Iron Sword' },
          type: { type: 'string', example: 'weapon' },
          tier: { type: 'integer', example: 1 },
        },
      },
      // ── Errors ────────────────────────────────────────────────────────────
      Error: {
        type: 'object',
        properties: { error: { type: 'string', example: 'Descriptive error message.' } },
      },
    },
    responses: {
      Unauthorized: {
        description: '401 — No token provided or token is invalid/expired.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Forbidden: {
        description: '403 — Authenticated user lacks permission.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      NotFound: {
        description: '404 — Resource not found.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      BadRequest: {
        description: '400 — Invalid or missing fields.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Conflict: {
        description: '409 — Unique constraint violation.',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
    },
  },

  paths: {
    // ── Auth ─────────────────────────────────────────────────────────────────
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Create a new user account',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SignupRequest' } } },
        },
        responses: {
          201: {
            description: 'User created successfully.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          409: { $ref: '#/components/responses/Conflict' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate and receive a JWT token',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: {
            description: 'Login successful. Copy the token and use the Authorize button (🔒) at the top of this page.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ── Characters ───────────────────────────────────────────────────────────
    '/characters': {
      post: {
        tags: ['Characters'],
        summary: 'Create a new character (authenticated user)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCharacterRequest' } } },
        },
        responses: {
          201: {
            description: 'Character created.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CharacterResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      get: {
        tags: ['Characters'],
        summary: "Get all of the authenticated user's characters",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of characters.',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/CharacterResponse' } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/characters/{id}': {
      get: {
        tags: ['Characters'],
        summary: 'Get a single character by ID (owner only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: {
            description: 'Character with equipped items.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CharacterWithItemsResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Characters'],
        summary: 'Update a character (owner only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateCharacterRequest' } } },
        },
        responses: {
          200: {
            description: 'Updated character.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CharacterResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Characters'],
        summary: 'Delete a character (owner only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: {
            description: 'Deleted character.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CharacterResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/characters/{id}/items': {
      post: {
        tags: ['Characters'],
        summary: 'Assign an item to a character (owner only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AddItemRequest' } } },
        },
        responses: {
          201: {
            description: 'Item assigned.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CharacterItemResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
          409: { $ref: '#/components/responses/Conflict' },
        },
      },
    },
    '/characters/{id}/items/{itemId}': {
      delete: {
        tags: ['Characters'],
        summary: 'Remove an item from a character (owner only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } },
          { name: 'itemId', in: 'path', required: true, schema: { type: 'integer', example: 1 } },
        ],
        responses: {
          200: {
            description: 'Item removed.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CharacterItemResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ── Classes ──────────────────────────────────────────────────────────────
    '/classes': {
      post: {
        tags: ['Classes'],
        summary: 'Create a new class (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClassRequest' } } },
        },
        responses: {
          201: {
            description: 'Class created.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ClassResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          409: { $ref: '#/components/responses/Conflict' },
        },
      },
      get: {
        tags: ['Classes'],
        summary: 'Get all classes (any authenticated user)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of classes.',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/ClassResponse' } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/classes/{id}': {
      get: {
        tags: ['Classes'],
        summary: 'Get a single class by ID (any authenticated user)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: {
            description: 'Class details.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ClassResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Classes'],
        summary: 'Update a class (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateClassRequest' } } },
        },
        responses: {
          200: {
            description: 'Updated class.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ClassResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
          409: { $ref: '#/components/responses/Conflict' },
        },
      },
      delete: {
        tags: ['Classes'],
        summary: 'Delete a class (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: {
            description: 'Deleted class.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ClassResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ── Items ─────────────────────────────────────────────────────────────────
    '/items': {
      post: {
        tags: ['Items'],
        summary: 'Create a new item (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateItemRequest' } } },
        },
        responses: {
          201: {
            description: 'Item created.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ItemResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          409: { $ref: '#/components/responses/Conflict' },
        },
      },
      get: {
        tags: ['Items'],
        summary: 'Get all items (any authenticated user)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of items.',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/ItemResponse' } },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/items/{id}': {
      get: {
        tags: ['Items'],
        summary: 'Get a single item by ID (any authenticated user)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: {
            description: 'Item details.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ItemResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Items'],
        summary: 'Update an item (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateItemRequest' } } },
        },
        responses: {
          200: {
            description: 'Updated item.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ItemResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
          409: { $ref: '#/components/responses/Conflict' },
        },
      },
      delete: {
        tags: ['Items'],
        summary: 'Delete an item (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', example: 1 } }],
        responses: {
          200: {
            description: 'Deleted item.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ItemResponse' } } },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
};