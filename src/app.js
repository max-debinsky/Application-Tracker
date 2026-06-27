import express from 'express';
import applicationsRouter from './modules/applications/applications.routes.js';
import authRouter from './modules/auth/auth.routes.js';
import errorHandler from './middleware/error.js';

const app = express();
app.use(express.json())
app.use('/api/applications', applicationsRouter);
app.use('/api/auth', authRouter);

app.get('/health', (req, res) => {
  res.json({status:"ok"})
})

app.use(errorHandler);

export default app;