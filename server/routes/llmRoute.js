import express from 'express';
import { chatWithLLM, analyzeDaily } from '../controllers/llmController.js';
const router = express.Router();

router.post('/', chatWithLLM);
router.post('/analyze', analyzeDaily);

export default router;
