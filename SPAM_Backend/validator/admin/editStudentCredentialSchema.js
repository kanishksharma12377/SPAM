import {z} from 'zod';
import registerSchema from './registerStudentSchema.js';

const editStuCredSchema = registerSchema.partial();
export default editStuCredSchema;