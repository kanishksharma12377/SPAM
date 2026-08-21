import express from 'express';
import {authCheck} from '../../middleware/authCheck.js';
 
import profileRouter from './profileRoute.js';
import registerRouter from './registerRoute.js';
import recordRouter from './recordRoute.js';
import uploadRouter from './uploadRoute.js';
import noticeRouter from './noticeRoute.js';
import logsRouter from './logsRoute.js';

const router = express.Router();
router.use(authCheck);

router.use('/profile',profileRouter);
router.use('/register',registerRouter);
router.use('/record',recordRouter);
router.use('/upload',uploadRouter);
router.use('/logs',logsRouter);
router.use('/notice',noticeRouter);
router.use((req, res) => res.status(404).json({ 
  success : false, 
  message : "api route not exist"
}));

export default router;