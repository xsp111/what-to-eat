import { twMerge } from 'tailwind-merge';

export default function Button(props) {
	const { children, className, onClick } = props;
	return (
		<button
			className={twMerge(
				'flex justify-center items-center px-2.5 py-0.5 rounded-lg border border-pink-300 text-red-300 font-normal text-sm',
				className,
			)}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
