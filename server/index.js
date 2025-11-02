import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';
import dataRoutes from './routes/data.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/data', dataRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MindMesh backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
