import bgImg from '/bg3.png';
import TimeClock from '../../components/timeClock';
import FoodOverview from './components/foodOverview';
import PageContainer from '../../components/pageContainer';
import Weather from './components/weather';
import HelloKittyTips from './components/helloKittyTips';

export default function MainPage() {
	return (
		<PageContainer
			bgImg={bgImg}
			className='pt-7 justify-start gap-5 overflow-auto'
		>
			<TimeClock />
			<Weather />
			<FoodOverview />
			<div className='h-[150px] w-full'>{/* 占位 */}</div>
			<HelloKittyTips />
		</PageContainer>
	);
}
