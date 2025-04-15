import express from 'express';
import { getAllTemplates, getTemplateById } from '../controllers/template.js';

const router = express.Router();

router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);

export default router;