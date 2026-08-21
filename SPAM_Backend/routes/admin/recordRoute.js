import express from 'express';
import {getRecordsList, getRecord, editRecord} from '../../controller/admin/recordController.js';

const router = express.Router();

router.get('/',getRecordsList);
router.get('/:s_id',getRecord);
router.patch('/:s_id',editRecord);

export default router;