import express from 'express';
import {getRequests, uploadRequest, deleteRequest, getProof} from '../../controller/student/uploadController.js';
import upload from '../../middleware/upload.js';

const router = express.Router();

router.get('/',getRequests);
router.post('/', upload.single('proof'), uploadRequest);
router.delete('/:v_id',deleteRequest);
router.get('/proof/:v_id', getProof);

export default router;