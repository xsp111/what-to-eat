import { ApiFetch } from '../utils';
import apiPrefix from './env';

async function login(loginInfo) {
	const res = await ApiFetch(apiPrefix + '/api/user/login', loginInfo);
	return res;
}

async function signUp(signUpInfo) {
	const res = await ApiFetch(apiPrefix + '/api/user/sign-up', signUpInfo);
	return res;
}

async function getUserInfoByToken() {
	const res = await ApiFetch(apiPrefix + '/api/user/get');
	return res;
}

async function editUserInfo(newInfo) {
	const res = await ApiFetch(apiPrefix + '/api/user/edit', { newInfo });
	return res;
}

async function changeUserAvatar(avatarFile) {
	const form = new FormData();
	form.append('file', avatarFile);
	const res = await fetch(apiPrefix + '/api/user/avatar-modify', {
		method: 'POST',
		credentials: 'include',
		body: form,
	});
	return res.json();
}

export { login, getUserInfoByToken, editUserInfo, changeUserAvatar, signUp };
