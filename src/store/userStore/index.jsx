import { createStore } from 'zustand';
import { getCookieByKey, removeCookieByKey } from '../../utils';
import * as userService from '../../service/userService';
import * as llmService from '../../service/llmService';

const userStore = createStore((_set, _get) => ({
	user: null,
	hkTips: undefined,
	setHkTips: async () => {
		const reader = await llmService.analyze();
		let botText = '';
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			const chunk = new TextDecoder().decode(value);
			botText += chunk;
			_set({
				hkTips: botText,
			});
		}
	},
	setUser: (userInfo) => {
		_set({
			user: userInfo,
		});
	},
	initLogState: () => {
		// check cookie
		const authToken = getCookieByKey('authToken');
		if (!authToken) return;
		const { setHkTips } = _get();
		userService.getUserInfoByToken().then((res) => {
			if (res.success) {
				_set({
					user: res.msg,
				});
			}
		});
		setHkTips();
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
	loginOrSignUp: (userInfo, isLogin = true) => {
		if (isLogin) {
			return userService.login(userInfo);
		} else {
			return userService.signUp(userInfo);
		}
	},
	logout: () => {
		removeCookieByKey('authToken');
		_set({
			user: null,
			hkTips: undefined,
		});
	},
}));
export default userStore;
