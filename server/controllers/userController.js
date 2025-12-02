import { staticDir } from '../app.js';
import * as userService from '../services/userService.js';
import path from 'path';
import fs from 'fs';

async function login(req, res) {
	console.log('app login');
	const loginInfo = req.body;
	const loginRes = await userService.login(loginInfo);
	const token = loginRes.msg.id;
	res.cookie('authToken', token, {
		secure: true,
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	res.status(200).json(loginRes);
}

async function signUp(req, res) {
	const signUpInfo = req.body;
	const signUpRes = await userService.signUp(signUpInfo);
	const token = signUpRes.msg.id;
	res.cookie('authToken', token, {
		secure: true,
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	res.status(200).json(signUpRes);
}

async function getUserInfo(req, res) {
	const { authToken } = req.cookies;
	if (!authToken) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const { success, msg: user } = await userService.getUserById(authToken);
	const resInfo = {
		success: success,
		msg: {
			id: user.id,
			name: user.name,
			avatar: user.avatar,
		},
	};
	res.status(200).json(resInfo);
}

async function editUserInfo(req, res) {
	const { authToken } = req.cookies;
	if (!authToken) {
		res.status(200).json({
			msg: '未登录',
		});
		return;
	}
	const { newInfo } = req.body;
	const { msg: newUserInfo } = await userService.editUserById(authToken, {
		name: newInfo.name,
		password: newInfo.password,
	});
	res.status(200).json({
		name: newUserInfo.name,
		id: newUserInfo.id,
	});
}

async function modifyUserAvatar(req, res) {
	const { authToken } = req.cookies;
	const { filename, path: distPath } = req.file;
	const { msg: user } = await userService.getUserById(authToken);
	const originalFilename = user.avatar;
	const publicPath = `public/${filename}`;
	if (originalFilename !== 'avatar/default.svg') {
		fs.unlink(path.join(staticDir, originalFilename), (err) => {
			if (err) {
				console.error('删除文件失败:', err);
			} else {
				console.log('文件删除成功');
			}
		});
		fs.unlink(publicPath, (err) => {
			if (err) {
				console.error('删除文件失败:', err);
			} else {
				console.log('文件删除成功');
			}
		});
	}
	fs.copyFile(distPath, publicPath, (err) => {
		if (err) {
			console.error('复制文件失败', err);
		}
	});
	const { msg: newUserInfo } = await userService.editUserById(authToken, {
		avatar: filename,
	});
	res.status(200).json({
		avatar: newUserInfo.avatar,
	});
}

export { login, signUp, getUserInfo, editUserInfo, modifyUserAvatar };
