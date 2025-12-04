import { createStore } from 'zustand';
import * as foodService from '../../service/foodService';

const foodStore = createStore((_set, _get) => ({
	foodList: [],
	initFoodList: (userId) => {
		if (!userId) {
			_set({
				foodList: [],
			});
			return;
		}
		foodService.getFood().then((foodList) => {
			_set({
				foodList: foodList.map((food) => ({
					id: food.id,
					name: food.name,
					refValue: food.ref_value,
					favor: food.favor,
				})),
			});
		});
	},
	addFood: async (food) => {
		const { foodList } = _get();
		const res = await foodService.addFood({
			name: food.name,
			ref_value: food.refValue,
			favor: food.favor,
		});
		const { success, msg } = res;
		if (success) {
			const newFood = msg;
			_set({
				foodList: [
					...foodList,
					{
						id: newFood.id,
						name: newFood.name,
						refValue: newFood.ref_value,
						favor: newFood.favor,
					},
				],
			});
			return {
				success,
			};
		} else {
			return {
				success,
				msg,
			};
		}
	},
	editFood: async (newFood) => {
		const { foodList } = _get();
		const { id, ...newFoodEditInfo } = newFood;
		const res = await foodService.editFood(id, {
			name: newFoodEditInfo.name,
			ref_value: newFoodEditInfo.refValue,
			favor: newFoodEditInfo.favor,
		});
		const { success, msg } = res;
		if (success) {
			const newFoodInfo = msg;
			_set({
				foodList: foodList.map((food) => {
					if (food.id === newFoodInfo.id)
						return {
							id: newFoodInfo.id,
							name: newFoodInfo.name,
							refValue: newFoodInfo.ref_value,
							favor: newFoodInfo.favor,
						};
					return food;
				}),
			});
			return {
				success,
			};
		} else {
			return {
				success,
				msg,
			};
		}
	},
	removeFood: async (id) => {
		const { foodList } = _get();
		const res = await foodService.deleteFood(id);
		const { success } = res;
		if (success) {
			_set({
				foodList: foodList.filter((item) => item.id !== id),
			});
		}
		return {
			success,
		};
	},
}));
export default foodStore;
