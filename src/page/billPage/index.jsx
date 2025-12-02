import bgImg from '/bg3.png';
import PageContainer from '../../components/pageContainer';
import DayBillView from './components/dayBillView';
import FoodsOpera from './components/foodsOpera';
import UnLoginModal from './components/unLoginModal';

export default function BillPage() {
	return (
		<PageContainer bgImg={bgImg}>
			<DayBillView />
			<FoodsOpera />
			<UnLoginModal />
		</PageContainer>
	);
}
