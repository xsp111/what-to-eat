import { ApiFetch } from '../utils';
import devPrefix from './env';

async function getFood() {
	return ApiFetch(devPrefix + '/api/food/get');
}
async function addFood(foodInfo) {
	return ApiFetch(devPrefix + '/api/food/add', { foodInfo });
}

async function deleteFood(id) {
	return ApiFetch(devPrefix + '/api/food/delete', { id });
}

async function editFood(id, foodInfo) {
	return ApiFetch(devPrefix + '/api/food/edit', { id, foodInfo });
}

export { getFood, addFood, deleteFood, editFood };
