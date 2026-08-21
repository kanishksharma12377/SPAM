import {z} from 'zod';

const loginSchema = z.object({
  role : z
    .enum(["admin","student"] , { message : "Role must either be admin or student"}), 
    
  username : z
    .string({ message : "Username must be a string" })
    .trim()
    .min(5 , { message : "Username must be at least 3 characters long" })
    .max(20 , { message : "Username must be less than 20 characters" })
    .toLowerCase(), 
    
  password : z
    .string({ message : "Password must be a string" })
    .trim()
    .min(8 , { message : "Password must be at least 3 characters long" })
    .max(15 , { message : "Password must be less than 15 characters" })
    .regex(/[A-Z]/ , { message : "Password must include at least one uppercase letter" })
    .regex(/[a-z]/ , { message : "Password must include at least one lowercase letter" })
    .regex(/[0-9]/ , { message : "Password must include at least one number" })
    .regex(/[^A-Za-z0-9]/ , { message : "Password must include at least one special character" })
    
}).strict();

export default loginSchema;