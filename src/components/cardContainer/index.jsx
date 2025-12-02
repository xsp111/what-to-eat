import { twMerge } from 'tailwind-merge';

export default function CardContainer({ children, className }) {
	return (
		<div
			className={twMerge(
				'w-full min-h-40 flex items-center gap-4 bg-white opacity-90 p-4 rounded-lg border border-pink-100 overflow-auto',
				className,
			)}
		>
			{children}
		</div>
	);
}
