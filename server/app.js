import express from 'express';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import templateRoutes from './routes/template.js';
import dotenv from 'dotenv';
import sequelize from './config/config.js';
import Template from './models/template.js';
import path from 'path';

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
app.use('/api/project', projectRoutes);
app.use('/api/template', templateRoutes);

app.get('/live-preview/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Template.findOne({ where: { id } });
    if (!result) return res.status(404).send('Template not found');

    const templateContent = result.content;
    const fileMap = {};
    templateContent.forEach(file => {
      fileMap[file.path] = file.content;
    });

    const indexHtml = fileMap['index.html'];
    if (!indexHtml) return res.status(404).send('index.html not found in template');

    let htmlWithFixedPaths = indexHtml;

    // Fix paths in src="..." and href="..."
    htmlWithFixedPaths = htmlWithFixedPaths.replace(/(src|href)=["'](?!https?:\/\/)([^"']+)["']/g, (match, attr, path) => {
      const fixedPath = `http://localhost:3000/live-preview/${id}/assets/${path}`;
      return `${attr}="${fixedPath}"`;
    });

    // Fix CSS url(...) paths
    htmlWithFixedPaths = htmlWithFixedPaths.replace(/url\(["']?(?!https?:\/\/)([^"')]+)["']?\)/g, (match, path) => {
      const fixedPath = `http://localhost:3000/live-preview/${id}/assets/${path}`;
      return `url("${fixedPath}")`;
    });

    res.send(htmlWithFixedPaths);
  } catch (err) {
    console.error("Live preview error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get(/^\/live-preview\/([^\/]+)\/assets\/(.*)/, async (req, res) => {
  const id = req.params[0];         // captures :id
  const encodedPath = req.params[1]; // captures :encodedPath
  const filePath = decodeURIComponent(encodedPath);

  try {
    const result = await Template.findOne({ where: { id } });
    if (!result) return res.status(404).send('Template not found');

    const templateContent = result.content;
    const file = templateContent.find(f => f.path === filePath);

    if (!file) return res.status(404).send('File not found');

    // Handle image (base64) or text
    if (/^images\//.test(filePath)) {
      const extension = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
      };
      const mimeType = mimeTypes[extension] || 'application/octet-stream';
      const buffer = Buffer.from(file.content, 'base64');
      res.setHeader('Content-Type', mimeType);
      return res.send(buffer);
    } else {
      // Assume text-based file
      const ext = path.extname(filePath);
      const textTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.html': 'text/html',
        '.json': 'application/json',
        '.map': 'application/json',
        '.scss': 'text/x-scss'
      };
      const contentType = textTypes[ext] || 'text/plain';
      res.setHeader('Content-Type', contentType);
      return res.send(file.content);
    }

  } catch (err) {
    console.error("Error serving file:", err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/edit-template/:id/data', async (req, res) => {
  const { id } = req.params;
  console.log("Fetching template data for edit:", id);
  try {
    const result = await Template.findOne({ where: { id } });
    if (!result) return res.status(404).send('Template not found');

    const templateContent = result.content;
    const fileMap = {};
    templateContent.forEach(file => {
      fileMap[file.path] = file.content;
    });

    const html = fileMap['index.html'];
    const css = Object.entries(fileMap)
      .filter(([path]) => (path.includes('.css') || path.includes('.scss')))
      .map(([_, content]) => content)
      .join('\n');

    // Optional: build assets array
    const assets = templateContent
      .filter(file => /^images\//.test(file.path)) // only images for now
      .map(file => ({
        name: path.basename(file.path),
        url: `/live-preview/${id}/assets/${file.path}`
      }));

    res.json({ html, css, assets });

  } catch (err) {
    console.error("Edit template error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
