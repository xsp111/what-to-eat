import { twMerge } from 'tailwind-merge';

export default function PageContainer({ children, bgImg, className }) {
	return (
		<div
			style={{
				background: `url(${bgImg})`,
				backgroundSize: 'cover',
			}}
			className={twMerge(
				'px-6 py-2 flex flex-col gap-2 justify-evenly items-center w-full h-[94vh] overflow-auto',
				className,
			)}
		>
			{children}
		</div>
	);
}
