import { ApiFetch } from '../utils';
import apiPrefix from './env';

async function getFood() {
	return ApiFetch(apiPrefix + '/api/food/get');
}
async function addFood(foodInfo) {
	return ApiFetch(apiPrefix + '/api/food/add', { foodInfo });
}

async function deleteFood(id) {
	return ApiFetch(apiPrefix + '/api/food/delete', { id });
}

async function editFood(id, foodInfo) {
	return ApiFetch(apiPrefix + '/api/food/edit', { id, foodInfo });
}

export { getFood, addFood, deleteFood, editFood };
