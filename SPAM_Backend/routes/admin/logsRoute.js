import express from 'express';
import {getLogs} from '../../controller/admin/logsController.js';

const router = express.Router();
router.get('/',getLogs);

export default router;