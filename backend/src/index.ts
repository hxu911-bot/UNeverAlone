import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config/env.js';
import { upload } from './middleware/upload.js';
import extractRouter from './routes/extract.js';
import generateRouter from './routes/generate.js';

validateConfig();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/extract', upload.single('file'), extractRouter);
app.use('/api', generateRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`POST /api/extract - Extract text from files`);
  console.log(`POST /api/generate - Generate personalized emails`);
});
