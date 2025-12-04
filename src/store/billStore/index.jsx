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
	addBill: async (bill) => {
		const { billList } = _get();
		const res = await billService.addBill(bill);
		const { success, msg } = res;
		if (success) {
			const newBill = msg;
			_set({
				billList: [...billList, newBill],
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
	editBill: async (newBill) => {
		const { billList } = _get();
		const { id, ...newBillEditInfo } = newBill;
		const res = await billService.editBill(id, newBillEditInfo);
		const { success, msg } = res;
		if (success) {
			const newBillInfo = msg;
			_set({
				billList: billList.map((bill) => {
					if (bill.id === newBillInfo.id) return newBillInfo;
					return bill;
				}),
			});
			return { success };
		} else {
			return {
				success,
				msg,
			};
		}
	},
	removeBill: async (id) => {
		const { billList } = _get();
		const res = await billService.deleteBill(id);
		const { success } = res;
		if (success) {
			_set({
				billList: billList.filter((item) => item.id !== id),
			});
		}
		return {
			success,
		};
	},
	getBillByID: (id) => {
		const { billList } = _get();
		return billList.find((bill) => bill.id === id);
	},
}));
export default billStore;
