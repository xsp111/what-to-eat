import db from '../db/index.js';

async function getUserById(id) {
	try {
		const user = await db.users.findFirst({
			where: {
				id: id,
			},
		});
		return {
			success: 1,
			msg: user,
		};
	} catch (e) {
		return {
			success: 0,
			msg: e,
		};
	}
}

async function editUserById(id, userInfo) {
	try {
		const newUserInfo = await db.users.update({
			where: {
				id,
			},
			data: userInfo,
		});
		return {
			success: 1,
			msg: {
				id: newUserInfo.id,
				name: newUserInfo.name,
				avatar: newUserInfo.avatar,
			},
		};
	} catch (e) {
		return {
			success: 0,
			msg: e,
		};
	}
}

async function login(loginInfo) {
	const { name, password } = loginInfo;
	const user = await db.users.findFirst({
		where: {
			name: name,
		},
	});
	if (!user) {
		return {
			success: 0,
			msg: '用户名不存在',
		};
	}
	if (password !== user.password) {
		return {
			success: 0,
			msg: '密码错误',
		};
	}
	return {
		success: 1,
		msg: {
			id: user.id,
			name: user.name,
			avatar: user.avatar,
		},
	};
}

async function signUp(signUpInfo) {
	try {
		const user = await db.users.create({
			data: { ...signUpInfo, avatar: '/avatar/default.svg' },
		});
		return {
			success: 1,
			msg: {
				id: user.id,
				name: user.name,
				avatar: user.avatar,
			},
		};
	} catch (e) {
		return {
			success: 0,
			msg: e,
		};
	}
}

export { login, signUp, getUserById, editUserById };
