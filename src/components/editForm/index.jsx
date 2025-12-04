import { useStore } from 'zustand';
import { DatePicker, Input, Select } from 'antd';
import Button from '../button';
import addIcon from '../../assets/add-bill.svg';
import { useContext, useState } from 'react';
import dayjs from 'dayjs';
import { billStore } from '../../store';
import { MessageContext } from '../rootLayout/context';
import { billTypeMap } from '../../constant/billType';
import { modalInfoEnum } from '../../constant/modalEnum';

export default function EditForm({ setVisible, initBillInfo }) {
	const id = initBillInfo.id;
	const today = new Date();
	const messageApi = useContext(MessageContext);
	const { addBill, editBill, removeBill } = useStore(billStore);
	const [bill, setBill] = useState({
		desc: '', // 不必要字段
		...initBillInfo,
	});
	const [loading, setLoading] = useState(false);
	const billTypeOptions = Array.from({ length: 5 }, (_, i) => i).map(
		(idx) => ({
			label: (
				<div className='flex w-12 gap-1'>
					<img src={billTypeMap[idx].icon} width={16} />
					<span className='text-sm text-gray-600'>
						{billTypeMap[idx].label}
					</span>
				</div>
			),
			value: idx,
		}),
	);

	function handleChange(e) {
		setBill({
			...bill,
			[e.target.name]: e.target.value,
		});
	}

	async function handleSave() {
		const date = bill.date;
		if (!date) {
			messageApi.error('请选择日期');
			return;
		}
		if (!bill?.title || !bill?.value) {
			messageApi.error('请输入账单名称和对应金额💰');
			return;
		}
		if (isNaN(bill.value) || Number(bill.value) <= 0) {
			messageApi.error('请输入正确的金额💰');
			return;
		}
		if (id) {
			const res = await editBill({
				...bill,
				id,
			});
			if (res.success) {
				messageApi.success('更新成功');
			} else {
				messageApi.error(res.msg);
				return;
			}
		} else {
			const res = await addBill({
				...bill,
			});
			if (res.success) {
				messageApi.success('新增成功');
			} else {
				messageApi.error(res.msg);
				return;
			}
		}
		setVisible({
			state: modalInfoEnum['unvisible'],
		});
	}

	async function handleDelete() {
		setLoading(true);
		const { success } = await removeBill(id);
		setLoading(false);
		if (success) {
			messageApi.success('已删除');
			setVisible({
				state: modalInfoEnum['unvisible'],
			});
		} else {
			messageApi.error('删除失败');
		}
	}

	return (
		<>
			<div className='flex justify-between items-center w-full gap-2'>
				<div className='flex items-center gap-2'>
					<img src={addIcon} width='16' />
					<span className='text-[16px]'>
						{id ? '编辑账单' : '新增账单'}
					</span>
				</div>
				<DatePicker
					defaultValue={bill?.date ? dayjs(bill.date) : dayjs(today)}
					onChange={(_, date) => setBill({ ...bill, date })}
				/>
			</div>
			<div className='flex items-center w-full'>
				<span className='flex-1 text-sm'>消费类型:</span>
				<Select
					className='w-full flex-3'
					value={bill?.type}
					onChange={(value) => {
						setBill({
							...bill,
							type: value,
						});
					}}
					options={billTypeOptions}
				/>
			</div>
			<div className='flex items-center w-full'>
				<span className='flex-1 text-sm'>账单名称:</span>
				<Input
					name='title'
					className='w-full flex-3'
					value={bill?.title || ''}
					onChange={handleChange}
				/>
			</div>
			<div className='flex items-center w-full'>
				<span className='flex-1 text-sm'>描述:</span>
				<Input
					name='desc'
					className='w-full flex-3'
					value={bill?.desc || ''}
					onChange={handleChange}
				/>
			</div>
			<div className='flex items-center w-full'>
				<span className='flex-1 text-sm'>金额:</span>
				<Input
					name='value'
					suffix={<span className='text-gray-400'>元</span>}
					className='w-full flex-3'
					value={bill?.value || ''}
					onChange={handleChange}
				/>
			</div>
			<div className='w-full flex justify-center items-center gap-2'>
				<Button
					className='w-full h-10  py-1.5 text-gray-600 bg-blue-50  border-sky-300'
					loading={loading}
					onClick={handleSave}
				>
					save
				</Button>
				{id && (
					<Button
						className='w-full  h-10  py-1.5  bg-red-50 '
						loading={loading}
						onClick={handleDelete}
					>
						delete
					</Button>
				)}
			</div>
		</>
	);
}
