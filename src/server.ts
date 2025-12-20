import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { DataStore } from './utils/dataStore';
import { authRouter } from './routes/auth';
import { booksRouter } from './routes/books';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Initialize data store
DataStore.initialize();

// Routes
app.use('/api', authRouter);
app.use('/api', booksRouter);

// Root route - serve index.html
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Library Tracker Server running on http://localhost:${PORT}`);
  console.log(`📚 Access the application at http://localhost:${PORT}`);
});
