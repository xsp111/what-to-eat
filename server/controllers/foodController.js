import * as foodService from '../services/foodService.js';

async function getFood(req, res) {
	const { authToken: userId } = req.cookies;
	if (!userId) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const foodList = await foodService.getFood(userId);
	res.status(200).json(foodList);
}

async function editFood(req, res) {
	const { id, foodInfo } = req.body;
	const result = await foodService.editFood(id, foodInfo);
	res.status(200).json(result);
}

async function addFood(req, res) {
	const { authToken: userId } = req.cookies;
	if (!userId) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const { foodInfo } = req.body;
	const result = await foodService.addFood(userId, foodInfo);
	res.status(200).json(result);
}

async function deleteFood(req, res) {
	const { authToken: userId } = req.cookies;
	if (!userId) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const { id: foodId } = req.body;
	const result = await foodService.deleteFood(userId, foodId);
	res.status(200).json(result);
}

export { getFood, addFood, deleteFood, editFood };
