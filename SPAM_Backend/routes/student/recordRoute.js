import express from 'express';
import {getRecord, editRecord} from '../../controller/student/recordController.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.get('/',getRecord);
router.patch('/',upload.single('image'),editRecord);

export default router;