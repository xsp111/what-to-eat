import { ApiFetch } from '../utils';
import devPrefix from './env';

async function login(loginInfo) {
	const res = await ApiFetch(devPrefix + '/api/user/login', loginInfo);
	return res;
}

async function signUp(signUpInfo) {
	const res = await ApiFetch(devPrefix + '/api/user/sign-up', signUpInfo);
	return res;
}

async function getUserInfoByToken() {
	const res = await ApiFetch(devPrefix + '/api/user/get');
	return res;
}

async function editUserInfo(newInfo) {
	const res = await ApiFetch(devPrefix + '/api/user/edit', { newInfo });
	return res;
}

async function changeUserAvatar(avatarFile) {
	const form = new FormData();
	form.append('file', avatarFile);
	const res = await fetch(devPrefix + '/api/user/avatar-modify', {
		method: 'POST',
		credentials: 'include',
		body: form,
	});
	return res.json();
}

export { login, getUserInfoByToken, editUserInfo, changeUserAvatar, signUp };
