import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import * as http from 'http';
import * as WebSocket from 'ws';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${port}`;

// Store location data and WebSocket connections in memory
const locations: { [key: string]: { lat: number; lng: number; timestamp: number } } = {};
const connections: { [key: string]: WebSocket[] } = {};

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Serve static files
app.get('/', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve track page
app.get('/track/:id', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/track.html'));
});

// Serve admin page
app.get('/admin', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// WebSocket connection handler
wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    const trackingId = req.url?.split('/')?.pop() || '';
    
    if (!connections[trackingId]) {
        connections[trackingId] = [];
    }
    connections[trackingId].push(ws);

    // Send initial location if available
    if (locations[trackingId]) {
        ws.send(JSON.stringify(locations[trackingId]));
    }

    ws.on('close', () => {
        connections[trackingId] = connections[trackingId].filter(conn => conn !== ws);
        if (connections[trackingId].length === 0) {
            delete connections[trackingId];
        }
    });
});

// Generate tracking link
app.post('/api/generate-link', (_req: Request, res: Response) => {
    const trackingId = nanoid(10);
    const trackingLink = `${baseUrl}/track/${trackingId}`;
    res.json({ trackingLink, trackingId });
});

// Save location data and broadcast to connected clients
app.post('/api/location/:trackingId', (req: Request<{ trackingId: string }>, res: Response) => {
    const { trackingId } = req.params;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const locationData = {
        lat,
        lng,
        timestamp: Date.now()
    };

    locations[trackingId] = locationData;

    // Broadcast to all connected clients for this tracking ID
    if (connections[trackingId]) {
        const message = JSON.stringify(locationData);
        connections[trackingId].forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    res.json({ success: true });
});

// Get location data
app.get('/api/location/:trackingId', (req: Request<{ trackingId: string }>, res: Response) => {
    const { trackingId } = req.params;
    const location = locations[trackingId];

    if (!location) {
        return res.status(404).json({ error: 'Location not found' });
    }

    res.json(location);
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 