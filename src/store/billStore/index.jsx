import { createStore } from 'zustand';
import * as billService from '../../service/billService';

const billStore = createStore((_set, _get) => ({
	billList: [],
	initBillList: (userId) => {
		if (!userId) {
			_set({
				billList: [],
			});
			return;
		}
		billService.getBill().then((billList) => {
			_set({
				billList: billList,
			});
		});
	},
	addBill: (bill) => {
		const { billList } = _get();
		billService.addBill(bill).then((res) => {
			const { success, msg: newBill } = res;
			if (success) {
				_set({
					billList: [...billList, newBill],
				});
			}
		});
	},
	editBill: (newBill) => {
		const { billList } = _get();
		const { id, ...newBillInfo } = newBill;
		billService.editBill(id, newBillInfo).then((res) => {
			const { success, msg: newBillInfo } = res;
			if (success) {
				_set({
					billList: billList.map((bill) => {
						if (bill.id === newBillInfo.id) return newBillInfo;
						return bill;
					}),
				});
			}
		});
	},
	removeBill: (id) => {
		const { billList } = _get();
		billService.deleteBill(id).then((res) => {
			const { success } = res;
			if (success) {
				_set({
					billList: billList.filter((item) => item.id !== id),
				});
			}
		});
	},
	getBillByID: (id) => {
		const { billList } = _get();
		return billList.find((bill) => bill.id === id);
	},
}));
export default billStore;
