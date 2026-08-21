import {z} from 'zod';
import setupSchema from './setupSchema.js';

const recordSchema = setupSchema.partial();
export default recordSchema;