import food from '../assets/biil-food.svg';
import learn from '../assets/bill-learn.svg';
import out from '../assets/bill-out.svg';
import media from '../assets/bill-media.svg';
import shopping from '../assets/bill-shopping.svg';

export const billTypeEnum = {
	吃喝: 0,
	出行: 1,
	娱乐: 2,
	学习: 3,
	购物: 4,
};

export const billTypeMap = {
	[billTypeEnum['吃喝']]: {
		label: '吃喝',
		icon: food,
	},
	[billTypeEnum['出行']]: {
		label: '出行',
		icon: out,
	},
	[billTypeEnum['娱乐']]: {
		label: '娱乐',
		icon: media,
	},
	[billTypeEnum['学习']]: {
		label: '学习',
		icon: learn,
	},
	[billTypeEnum['购物']]: {
		label: '购物',
		icon: shopping,
	},
};
