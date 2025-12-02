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
	addFood: (food) => {
		const { foodList } = _get();
		foodService
			.addFood({
				name: food.name,
				ref_value: food.refValue,
				favor: food.favor,
			})
			.then((res) => {
				const { success, msg: newFood } = res;
				if (success) {
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
				}
			});
	},
	editFood: (newFood) => {
		const { foodList } = _get();
		const { id, ...newFoodInfo } = newFood;
		foodService
			.editFood(id, {
				name: newFoodInfo.name,
				ref_value: newFoodInfo.refValue,
				favor: newFoodInfo.favor,
			})
			.then((res) => {
				const { success, msg: newFoodInfo } = res;
				if (success) {
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
				}
			});
	},
	removeFood: (id) => {
		const { foodList } = _get();
		foodService.deleteFood(id).then((res) => {
			const { success } = res;
			if (success) {
				_set({
					foodList: foodList.filter((item) => item.id !== id),
				});
			}
		});
	},
}));
export default foodStore;
