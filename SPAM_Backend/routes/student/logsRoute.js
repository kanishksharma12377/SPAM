import express from 'express';
import {getLogs} from '../../controller/student/logsController.js';

const router = express.Router();
router.get('/',getLogs);

export default router;