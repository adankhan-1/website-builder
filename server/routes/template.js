import express from 'express';
import { getAllTemplates, getTemplateById, insertTemplate } from '../controllers/template.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getAllTemplates);
router.get('/:id', getTemplateById);
router.post('/', insertTemplate);

export default router;