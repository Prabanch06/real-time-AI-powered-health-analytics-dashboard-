import { WebSocketServer, WebSocket } from 'ws';

let clients: WebSocket[] = [];

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('Client connected');

    ws.on('close', () => {
      clients = clients.filter((client) => client !== ws);
      console.log('Client disconnected');
    });
  });
}

export function broadcastUpdate(type: string, data: any) {
  const message = JSON.stringify({ type, data });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
