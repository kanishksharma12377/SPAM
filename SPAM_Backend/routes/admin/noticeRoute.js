import express from 'express';
import {getNotices, createNotice, deleteNotice} from '../../controller/admin/noticeController.js';

const router = express.Router();

router.get('/',getNotices);
router.post('/',createNotice);
router.delete('/:n_id', deleteNotice);

export default router;