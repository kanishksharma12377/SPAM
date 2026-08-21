import {z} from 'zod';

const verifySchema = z.object({
  status : z
    .enum(["pending","accepted","rejected"] , { message : "Status must either be accepted or rejected or pending"}), 
    
  feedback : z
    .string({ message : "Feedback must be a string"})
    .trim()
    .max(1000 , { message : "Feedback must be less than 1000 characters"})
    .optional()
    
}).strict();

export default verifySchema;