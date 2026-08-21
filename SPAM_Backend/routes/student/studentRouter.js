import express from 'express';

import {authCheck, setupCheck} from '../../middleware/authCheck.js';
import {setupRecord} from '../../controller/student/recordController.js';
import upload from '../../middleware/upload.js';

import profileRouter from './profileRoute.js';
import recordRouter from './recordRoute.js';
import uploadRouter from './uploadRoute.js';
import noticeRouter from './noticeRoute.js';
import logsRouter from './logsRoute.js';

const router = express.Router();

router.use(authCheck);

router.post('/record/setup', upload.single('image'), setupRecord);

router.use('/profile', setupCheck, profileRouter);
router.use('/record', setupCheck, recordRouter);
router.use('/upload', setupCheck, uploadRouter);
router.use('/logs', setupCheck, logsRouter);
router.use('/notice', setupCheck, noticeRouter);
router.use((req, res) => res.status(404).json({ 
  success : false, 
  message : "api route not exist"
}));

export default router;