import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
console.log('WS chat on ws://localhost:8080');

function broadcast(sender, data) {
  wss.clients.forEach((c) => {
    if (c.readyState === 1) c.send(data);
  });
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ system: 'welcome', clients: wss.clients.size }));
  ws.on('message', (m) => {
    let msg = m.toString();
    try { const o = JSON.parse(msg); msg = JSON.stringify({ from: 'user', ...o }); } catch {}
    broadcast(ws, msg);
  });
});
