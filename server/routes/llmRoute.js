import express from 'express';
import {
	chatWithLLM,
	analyzeDaily,
	getHistoryCtx,
	clearHistory,
} from '../controllers/llmController.js';
const router = express.Router();

router.post('/', chatWithLLM);
router.post('/analyze', analyzeDaily);
router.post('/history', getHistoryCtx);
router.post('/clear', clearHistory);

export default router;
