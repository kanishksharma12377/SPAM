import express from 'express';
import {getNotices} from '../../controller/student/noticeController.js';

const router = express.Router();
router.get('/',getNotices);

export default router;