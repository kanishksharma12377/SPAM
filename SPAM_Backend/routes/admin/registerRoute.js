import express from 'express';
import {getRegisteredStudents, registerStudent, editStudentCredential, unregisterStudent} from '../../controller/admin/registerController.js';

const router = express.Router();

router.get('/',getRegisteredStudents);
router.post('/new',registerStudent);
router.patch('/:s_id',editStudentCredential);
router.delete('/:s_id',unregisterStudent);

export default router;