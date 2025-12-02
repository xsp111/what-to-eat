import db from '../db/index.js';

async function getFood(id) {
	const foodList = await db.food.findMany({
		where: {
			ownerId: id,
		},
	});
	return foodList;
}

async function editFood(id, foodInfo) {
	try {
		const newFood = await db.food.update({
			where: {
				id,
			},
			data: foodInfo,
		});
		return {
			success: 1,
			msg: newFood,
		};
	} catch (err) {
		return {
			success: 0,
			msg: err,
		};
	}
}

async function addFood(userId, foodInfo) {
	try {
		const food = await db.food.create({
			data: {
				...foodInfo,
				ownerId: userId,
			},
		});
		return {
			success: 1,
			msg: food,
		};
	} catch (err) {
		return {
			success: 0,
			msg: err,
		};
	}
}

async function deleteFood(userId, foodId) {
	try {
		await db.food.delete({
			where: {
				id: foodId,
				ownerId: userId,
			},
		});
		return {
			success: 1,
		};
	} catch (err) {
		return {
			success: 0,
			msg: err,
		};
	}
}

export { getFood, addFood, deleteFood, editFood };
