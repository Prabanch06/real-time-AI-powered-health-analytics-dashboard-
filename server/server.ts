import express from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import { WebSocketServer } from 'ws';
import { setupWebSocket } from './websocket_manager';
import authRoutes from './auth';
import analyticsRoutes from './analytics_engine';
import aiRoutes from './ai_engine';
import { initDb } from './database';
import net from 'net';

async function getFreePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(startPort, '0.0.0.0', () => {
      const port = (srv.address() as net.AddressInfo).port;
      srv.close(() => resolve(port));
    });
    srv.on('error', () => {
      resolve(getFreePort(startPort + 1));
    });
  });
}

async function startServer() {
  const app = express();
  const startPort = Number(process.env.PORT) || 3001;
  const port = await getFreePort(startPort);

  // Initialize DB
  initDb();

  app.use(express.json());

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/ai', aiRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Create HTTP server
  const server = http.createServer(app);

  // Setup WebSocket server
  const wss = new WebSocketServer({ server });
  setupWebSocket(wss);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const hmrPort = await getFreePort(24678);
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { port: hmrPort }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    // Fallback for SPA routing
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  server.on('error', (e: any) => {
    console.error(e);
  });

  server.on('listening', () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.listen(port, '0.0.0.0');
}

startServer();
