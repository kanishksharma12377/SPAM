import express from 'express';
import {getRequests, verifyRequest, getProof} from '../../controller/admin/uploadController.js';

const router = express.Router();

router.get('/',getRequests);
router.patch('/:v_id',verifyRequest);
router.get('/proof/:v_id', getProof);

export default router;