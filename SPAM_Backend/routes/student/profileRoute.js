import express from 'express';
import {getProfile, editProfile} from '../../controller/student/profileController.js';

const router = express.Router();

router.get('/',getProfile);
router.patch('/',editProfile);

export default router;