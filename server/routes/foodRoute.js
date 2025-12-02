import express from 'express';
import {
	getFood,
	addFood,
	deleteFood,
	editFood,
} from '../controllers/foodController.js';
const router = express.Router();

router.post('/get', getFood);
router.post('/add', addFood);
router.post('/edit', editFood);
router.post('/delete', deleteFood);

export default router;
