import express from 'express';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import websiteRoutes from './routes/website.js';
import templateRoutes from './routes/template.js';
import dotenv from 'dotenv';
import sequelize from './config/config.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const SequelizeSession = SequelizeStore(session.Store);

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const sessionStore = new SequelizeSession({
  db: sequelize,
});

sessionStore.sync();

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use('/api/auth', authRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/template', templateRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
