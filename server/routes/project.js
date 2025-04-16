import express from 'express';
import { insertProject, getProject, getProjectsByUserId } from '../controllers/project.js';

const router = express.Router();

router.post('/', insertProject);
router.get('/:id', getProject);
router.get('/user/:userId', getProjectsByUserId);

// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { content } = req.body;
//   await db.query('UPDATE websites SET content = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3', [
//     content, id, req.session.userId
//   ]);
//   res.sendStatus(200);
// });

export default router;