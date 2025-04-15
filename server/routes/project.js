import express from 'express';
import { insertProject, getProject } from '../controllers/project.js';

const router = express.Router();

router.post('/', insertProject);
router.get('/:id', getProject);

// router.get('/', async (req, res) => {
//   if (!req.session.userId) return res.sendStatus(401);
//   const result = await db.query('SELECT * FROM websites WHERE user_id = $1', [req.session.userId]);
//   res.json(result.rows);
// });

// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { content } = req.body;
//   await db.query('UPDATE websites SET content = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3', [
//     content, id, req.session.userId
//   ]);
//   res.sendStatus(200);
// });

export default router;