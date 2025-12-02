import bgImg from '/bg2.png';
import PageContainer from '../../components/pageContainer';
import Profile from './components/profile';

export default function SettingsPage() {
	return (
		<PageContainer bgImg={bgImg} className='p-0 pt-[15vh]'>
			<Profile />
		</PageContainer>
	);
}
