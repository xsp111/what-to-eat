import express from 'express';
import {
	getBill,
	addBill,
	deleteBill,
	editBill,
} from '../controllers/billController.js';
const router = express.Router();

router.post('/get', getBill);
router.post('/add', addBill);
router.post('/edit', editBill);
router.post('/delete', deleteBill);

export default router;
