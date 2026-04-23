import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import authRoutes from './routes/authRoutes.js';
import characterRoutes from './routes/characterRoutes.js';
import classRoutes from './routes/classRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());

// ── API Documentation ───────────────────────────────────────────────────────
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true, // keep JWT token across page reloads
    },
    customSiteTitle: 'Character Creation API',
  })
);

// Serve raw OpenAPI spec as JSON (useful for external tooling)
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/items', itemRoutes);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 API docs: http://localhost:${PORT}/api-docs`);
});