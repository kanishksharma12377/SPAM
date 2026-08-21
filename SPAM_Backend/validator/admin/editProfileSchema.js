import {z} from 'zod';

const editProfileSchema = z.object({
  name : z
    .string({ message : "Name must be a string" })
    .trim()
    .min(3 , { message : "Name must be at least 3 characters long" })
    .max(30 , { message : "Name must be less than 30 characters" })
    .toLowerCase()
    .optional(), 
  
  contact : z
    .coerce.string()
    .trim()
    .regex(/^[0-9]{10}$/ , { message : "Contact must be a valid 10-digit number" })
    .optional(), 
   
  gmail : z
    .string({ message : "Gmail must be a string" }) 
    .trim()
    .email({ message : "Gmail must be in proper email formate" })
    .endsWith("@gmail.com" , { message : "Only gmail are allowed" })
    .toLowerCase()
    .optional(), 
  
  image : z
    .string({ message : "Image must be a string" })
    .trim()
    .regex(/\.(jpg|jpeg|png|gif|webp)$/i , { message : "Only image files are allowed" })
    .optional(), 
  
  username : z
    .string({ message : "Username must be a string" })
    .trim()
    .min(5 , { message : "Username must be at least 5 characters long" })
    .max(20 , { message : "Username must be less than 20 characters" })
    .toLowerCase()
    .optional(), 
    
  password : z
    .string({ message : "Password must be a string" })
    .trim()
    .min(8 , { message : "Password must be at least 8 characters long" })
    .max(15 , { message : "Password must be less than 15 characters" })
    .regex(/[A-Z]/ , { message : "Password must include at least one uppercase letter" })
    .regex(/[a-z]/ , { message : "Password must include at least one lowercase letter" })
    .regex(/[0-9]/ , { message : "Password must include at least one number" })
    .regex(/[^A-Za-z0-9]/ , { message : "Password must include at least one special character" })
    .optional()
    
}).strict();

export default editProfileSchema;