import { createStore } from 'zustand';
import { getCookieByKey, removeCookieByKey } from '../../utils';
import * as userService from '../../service/userService';

const userStore = createStore((_set, _get) => ({
	user: null,
	hkTips: undefined,
	setHkTips: (tips) => {
		console.log(111, tips);
		_set({
			hkTips: tips,
		});
	},
	setUser: (userInfo) => {
		_set({
			user: userInfo,
		});
	},
	initLogState: () => {
		// check cookie
		const authToken = getCookieByKey('authToken');
		if (!authToken) {
			_set({
				showUnloginModalTip: true,
			});
			return;
		}
		userService.getUserInfoByToken().then((res) => {
			if (res.success) {
				_set({
					user: res.msg,
				});
			}
		});
	},
	editUserInfo: (newInfo) => {
		const { avatarFile, ...info } = newInfo;
		let editTask = null;
		if (avatarFile) {
			editTask = Promise.all([
				userService.changeUserAvatar(avatarFile),
				userService.editUserInfo(info),
			]);
		} else {
			editTask = Promise.all([userService.editUserInfo(info)]);
		}

		return editTask
			.then((res) => {
				const { user } = _get();
				let newUserInfo = user;
				res.map((res) => {
					newUserInfo = {
						...newUserInfo,
						...res,
					};
				});
				_set({
					user: newUserInfo,
				});
				return {
					success: 1,
				};
			})
			.catch((e) => {
				return {
					success: 0,
					msg: e,
				};
			});
	},
	getToken: () => {
		const { userId } = _get();
		return userId;
	},
	logout: () => {
		removeCookieByKey('authToken');
		_set({
			user: null,
		});
	},
}));
export default userStore;
