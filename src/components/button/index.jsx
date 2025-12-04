import { LoadingOutlined } from '@ant-design/icons';
import { twMerge } from 'tailwind-merge';

export default function Button(props) {
	const { children, className, onClick, loading = false } = props;
	return (
		<button
			className={twMerge(
				`flex justify-center items-center px-2.5 py-0.5 rounded-lg border border-pink-300 text-red-300 font-normal text-sm `,
				className,
				loading ? 'bg-gray-300 border-none' : '',
			)}
			onClick={onClick}
			disabled={loading}
		>
			{loading ? <LoadingOutlined /> : children}
		</button>
	);
}
