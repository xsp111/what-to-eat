import db from '../db/index.js';

async function getBill(id) {
	const billList = await db.bill.findMany({
		where: {
			ownerId: id,
		},
	});
	return billList;
}

async function editBill(id, billInfo) {
	try {
		const newBill = await db.bill.update({
			where: {
				id,
			},
			data: billInfo,
		});
		return {
			success: 1,
			msg: newBill,
		};
	} catch (err) {
		return {
			success: 0,
			msg: err,
		};
	}
}

async function addBill(userId, billInfo) {
	try {
		const bill = await db.bill.create({
			data: {
				...billInfo,
				ownerId: userId,
			},
		});
		return {
			success: 1,
			msg: bill,
		};
	} catch (err) {
		return {
			success: 0,
			msg: err,
		};
	}
}

async function deleteBill(userId, billId) {
	try {
		await db.bill.delete({
			where: {
				id: billId,
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

export { getBill, addBill, deleteBill, editBill };
