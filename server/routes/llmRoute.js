import express from 'express';
import {
	chatWithLLM,
	analyzeDaily,
	getHistoryCtx,
} from '../controllers/llmController.js';
const router = express.Router();

router.post('/', chatWithLLM);
router.post('/analyze', analyzeDaily);
router.post('/history', getHistoryCtx);

export default router;
