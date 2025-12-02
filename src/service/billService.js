import { ApiFetch } from '../utils';
import devPrefix from './env';

async function getBill() {
	return ApiFetch(devPrefix + '/api/bill/get');
}
async function addBill(billInfo) {
	return ApiFetch(devPrefix + '/api/bill/add', { billInfo });
}

async function deleteBill(id) {
	return ApiFetch(devPrefix + '/api/bill/delete', { id });
}

async function editBill(id, billInfo) {
	return ApiFetch(devPrefix + '/api/bill/edit', { id, billInfo });
}

export { getBill, addBill, deleteBill, editBill };
