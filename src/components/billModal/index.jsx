import { Modal } from 'antd';
import EditForm from '../editForm';
import CardContainer from '../cardContainer';
import { useStore } from 'zustand';
import { billStore } from '../../store';
import { modalInfoEnum } from '../../constant/modalEnum';

export default function BillModal({ setModalState, initInfo }) {
	const { id, ...billInfo } = initInfo;
	const { getBillByID } = useStore(billStore);
	const initBillInfo = getBillByID(id) || {
		...billInfo,
	};
	return (
		<Modal
			centered
			open
			onCancel={() => {
				setModalState({
					state: modalInfoEnum['unvisible'],
				});
			}}
			footer={null}
		>
			<CardContainer className='flex-col border-none'>
				<EditForm
					setVisible={setModalState}
					initBillInfo={initBillInfo}
				/>
			</CardContainer>
		</Modal>
	);
}
