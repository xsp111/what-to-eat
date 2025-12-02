import * as billService from '../services/billService.js';

async function getBill(req, res) {
	const { authToken: userId } = req.cookies;
	if (!userId) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const billList = await billService.getBill(userId);
	res.status(200).json(billList);
}

async function editBill(req, res) {
	const { id, billInfo } = req.body;
	const result = await billService.editBill(id, billInfo);
	res.status(200).json(result);
}

async function addBill(req, res) {
	const { authToken: userId } = req.cookies;
	if (!userId) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const { billInfo } = req.body;
	const result = await billService.addBill(userId, billInfo);
	res.status(200).json(result);
}

async function deleteBill(req, res) {
	const { authToken: userId } = req.cookies;
	if (!userId) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const { id: billId } = req.body;
	const result = await billService.deleteBill(userId, billId);
	res.status(200).json(result);
}

export { getBill, addBill, deleteBill, editBill };
