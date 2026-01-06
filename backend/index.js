const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
let mongoose;
try {
  mongoose = require('mongoose');
} catch (e) {
  console.warn('Optional: mongoose not found. To enable MongoDB, install mongoose and set MONGODB_URI.');
}
let cookieParser;
try {
  cookieParser = require('cookie-parser');
} catch (e) {
  console.warn('Optional: cookie-parser not found. Cookies will be unavailable until it is installed.');
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB when provided and mongoose is available
if (process.env.MONGODB_URI && mongoose) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not set; running without DB (in-memory data only)');
} else {
  console.warn('MONGODB_URI set but mongoose not installed; skipping DB connection');
}

// Cookies (optional)
if (cookieParser) app.use(cookieParser());

// Middleware
app.use(cors());
app.use(express.json());

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Test routes
app.get('/', (req, res) => {
  res.json({ message: 'Backend server live!' });
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    data: ['Test 1', 'Test 2'],
    timestamp: new Date().toISOString()
  });
});

const challengeRoutes = require("./routes/challenges");
const aiRoutes = require("./routes/ai");
const authRoutes = require("./routes/auth");

app.use("/api/challenges", challengeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);

// Storage route (Cloudinary or local fallback)
const storageRoutes = require('./routes/storage');
app.use('/api/storage', storageRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend ONLY in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
