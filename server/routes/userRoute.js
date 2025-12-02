import express from 'express';
import multer from 'multer';
import path from 'path';
import {
	login,
	signUp,
	getUserInfo,
	editUserInfo,
	modifyUserAvatar,
} from '../controllers/userController.js';

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'dist/'),
	filename: (req, file, cb) => {
		cb(
			null,
			`avatar/${
				Date.now() +
				Math.floor(Math.random() * 1000) +
				path.extname(file.originalname)
			}`,
		);
	},
});
const upload = multer({ storage });

router.post('/login', login);
router.post('/sign-up', signUp);
router.post('/get', getUserInfo);
router.post('/edit', editUserInfo);
router.post('/avatar-modify', upload.single('file'), modifyUserAvatar);

export default router;
