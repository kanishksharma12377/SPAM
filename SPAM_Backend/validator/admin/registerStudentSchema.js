import {z} from 'zod';

const registerSchema = z.object({
  s_id : z
    .string({ message : "s_id must be a string" })
    .trim()
    .regex(/^s[a-z]{2}\d{4,}$/i, { message: "Invalid student ID format. s_id = 'S[branch(2 char)][4 digit no]' . eg - SCS0021"})
    .toLowerCase(), 
    
  name : z
    .string({ message : "Name must be a string" })
    .trim()
    .min(3 , { message : "Name must be at least 3 characters long" })
    .max(30 , { message : "Name must be less than 30 characters" })
    .toLowerCase(), 
  
  username : z
    .string({ message : "Username must be a string" })
    .trim()
    .min(5 , { message : "Username must be at least 5 characters long" })
    .max(20 , { message : "Username must be less than 20 characters" })
    .toLowerCase(), 
    
  password : z
    .string({ message : "Password must be a string" })
    .min(8 , { message : "Password must be at least 8 characters long" })
    .max(15 , { message : "Password must be less than 15 characters" })
    .regex(/[A-Z]/ , { message : "Password must include at least one uppercase letter" })
    .regex(/[a-z]/ , { message : "Password must include at least one lowercase letter" })
    .regex(/[0-9]/ , { message : "Password must include at least one number" })
    .regex(/[^A-Za-z0-9]/ , { message : "Password must include at least one special character" }), 
    
  role1 : z
    .enum(["1yr","2yr","3yr","4yr"] , { message : "role1 value must be 1yr / 2yr / 3yr / 4yr"}), 
  
  role2 : z
    .enum(["cs","ce","me","ee"] , { message : "role2 value must be cs / ce / me / ee"}), 
    
  role3 : z
    .enum(["skilled","none"] , { message : "role3 value must be either skilled or none"}) 
    
}).strict();

export default registerSchema;