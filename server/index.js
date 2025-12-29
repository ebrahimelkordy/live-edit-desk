import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import portfolioHandler from '../api/portfolio.js';
import healthHandler from '../api/health.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper to convert Vercel-style handler to Express handler
const wrapHandler = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error('Error in handler:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    }
};

// API Routes
app.all('/api/portfolio', wrapHandler(portfolioHandler));
app.all('/api/health', wrapHandler(healthHandler));

// Default route
app.get('/', (req, res) => {
    res.send('Portfolio Backend API is running');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Connected to MongoDB: ${process.env.MONGODB_DB || 'Unknown'}`);
});
