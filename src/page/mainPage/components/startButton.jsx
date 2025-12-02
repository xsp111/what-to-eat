export default function StartButton({ disable, onClick }) {
	return (
		<button
			className={`flex justify-center items-center px-2.5 py-1.5 rounded-sm text-white ${
				disable ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-300'
			}`}
			onClick={onClick}
		>
			<span className='text-xl'>start</span>
		</button>
	);
}
