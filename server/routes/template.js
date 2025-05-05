import express from 'express';
import { getAllTemplates, getTemplateById, insertTemplate, deleteTemplate, updateTemplate } from '../controllers/template.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getAllTemplates);
router.get('/:id', checkAuth, getTemplateById);
router.post('/',checkAuth, insertTemplate);
router.delete('/:id', checkAuth, deleteTemplate);
router.patch('/:id', checkAuth, updateTemplate);

export default router;