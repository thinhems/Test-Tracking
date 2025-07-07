const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Lưu trữ vị trí (trong bộ nhớ - trong thực tế nên dùng database)
const locations = new Map();

app.use(express.json());
app.use(express.static('public'));

// API tạo ID theo dõi mới
app.post('/api/tracking', (req, res) => {
    const trackingId = uuidv4();
    locations.set(trackingId, null);
    res.json({ trackingId });
});

// API cập nhật vị trí
app.post('/api/location/:trackingId', (req, res) => {
    const { trackingId } = req.params;
    const { lat, lng } = req.body;

    if (!locations.has(trackingId)) {
        return res.status(404).json({ error: 'ID không tồn tại' });
    }

    locations.set(trackingId, {
        lat,
        lng,
        timestamp: new Date()
    });

    res.json({ success: true });
});

// API lấy vị trí
app.get('/api/location/:trackingId', (req, res) => {
    const { trackingId } = req.params;
    const location = locations.get(trackingId);

    if (!location) {
        return res.status(404).json({ error: 'Không tìm thấy vị trí' });
    }

    res.json(location);
});

// Route cho trang theo dõi
app.get('/track/:trackingId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'track.html'));
});

// Route mặc định
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
}); 