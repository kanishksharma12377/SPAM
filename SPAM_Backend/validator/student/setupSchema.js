import {z} from 'zod';

const nameSchema = z.object({
  firstName : z
    .string({ message : "First Name must be a string" })
    .trim()
    .min(3 , { message : "First Name must be at least 3 characters long" })
    .max(30 , { message : "First Name must be less than 30 characters" })
    .toLowerCase(), 
    
  middleName : z
    .string({ message : "Middle Name must be a string" })
    .trim()
    .max(30 , { message : "Middle Name must be less than 30 characters" })
    .toLowerCase()
    .optional(), 
    
  lastName : z
    .string({ message : "Last Name must be a string" })
    .trim()
    .min(3 , { message : "Last Name must be at least 3 characters long" })
    .max(30 , { message : "LastName must be less than 30 characters" })
    .toLowerCase()
  
});

const addressSchema = z.object({
  locality : z
    .string({ message : "Locality must be a string" })
    .trim()
    .min(3 , { message : "Locality must be at least 3 characters long" })
    .max(50 , { message : "Locality must be less than 50 characters" })
    .toLowerCase()
    .optional(), 
    
  city : z
    .string({ message : "City name must be a string" })
    .trim()
    .min(3 , { message : "City name must be at least 3 characters long" })
    .max(30 , { message : "city name must be less than 30 characters" })
    .toLowerCase(), 
    
  district : z
    .string({ message : "District name must be a string" })
    .trim()
    .min(3 , { message : "District name must be at least 3 characters long" })
    .max(30 , { message : "District name must be less than 30 characters" })
    .toLowerCase(), 
  
  state : z
    .string({ message : "State name must be a string" })
    .trim()
    .min(3 , { message : "State name must be at least 3 characters long" })
    .max(30 , { message : "State name must be less than 30 characters" })
    .toLowerCase(), 
  
  pincode : z
    .coerce.string()
    .regex(/^[0-9]{6}$/, { message: "Invalid pincode" }),
    
});

const socialSchema = z.object({
  name : z
    .string({ message : "Platform name must be a string" })
    .trim()
    .min(3 , { message : "Platform name must be at least 3 characters long" })
    .max(30 , { message : "Platform name must be less than 30 characters" })
    .toLowerCase(), 
    
  link : z
    .string({ message : "Account link must be a string" })
    .trim()
    .url({ message : "Proper account url is required"})
});

const docSchema = z.object({
  name : z
    .string({ message : "Document name must be a string" })
    .trim()
    .min(3 , { message : "Document name must be at least 3 characters long" })
    .max(30 , { message : "Document name must be less than 30 characters" })
    .toLowerCase(), 
    
  doc_no : z
    .string({ message : "Document no/id must be a string" })
    .trim()
    .max(20 , { message : "Document no/id must be less than 20 characters" })
    .toLowerCase(), 
    
  image : z
    .string({ message : "Image must be a string" })
    .trim()
    .regex(/\.(jpg|jpeg|png|gif|webp)$/i , { message : "Only image files are allowed" })
    .optional()
});

const setupSchema = z.object({
  name : nameSchema, 
  
  fatherName : z
    .string({ message : "Father Name must be a string" })
    .trim()
    .toLowerCase()
    .transform(val => val === '' ? undefined : val)
    .refine(val => !val || (val.length >= 3 && val.length <= 30), {
      message: "Father Name must be between 3 and 30 characters"
    })
    .optional(), 
    
  motherName : z
    .string({ message : "Mother Name must be a string" })
    .trim()
    .toLowerCase()
    .transform(val => val === '' ? undefined : val)
    .refine(val => !val || (val.length >= 3 && val.length <= 30), {
      message: "Mother Name must be between 3 and 30 characters"
    })
    .optional(), 
  
  dob : z
    .string({ message : "DOB must be a string" })
    .regex(/^\d{4}-\d{2}-\d{2}$/ , { message: "DOB must be in YYYY-MM-DD format" })
    .transform((value) => new Date(value)) 
    .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" }), 
  
  gender : z
    .enum(["male","female","other"], { message : "Wrong gender value" }), 
  
  category : z
    .enum(["gen","obc","st","sc"], { message : "Wrong category value" }), 
  
  image : z
    .string({ message : "Image must be a string" })
    .trim()
    .regex(/\.(jpg|jpeg|png|gif|webp)$/i , { message : "Only image files are allowed" })
    .optional(), 
  
  gmail : z
    .string({ message : "Gmail must be a string" })
    .trim()
    .email({ message : "Gmail must be in proper email formate" })
    .endsWith("@gmail.com" , { message : "Only gmail are allowed" }) 
    .toLowerCase(), 
  
  contact : z
    .coerce.string()
    .trim()
    .regex(/^[0-9]{10}$/ , { message : "Contact must be a valid 10-digit number" }), 
  
  address : addressSchema, 
    
  class : z
    .enum(["1yr","2yr","3yr","4yr"], { message : "Invalid class (year)" }), 
    
  branch : z
    .enum(["cs","ce","me","ee"], { message : "Only CS, CE, ME, EE branch available" }), 
  
  socialAccount : z
    .array(socialSchema)
    .optional(), 
    
  profile : z
    .string({ message : "Profile must be a string" })
    .trim()
    .toLowerCase()
    .transform(val => val === '' ? undefined : val)
    .refine(val => !val || (val.length >= 3 && val.length <= 30), {
      message: "Profile must be between 3 and 30 characters"
    })
    .optional(), 
    
  document : z
    .array(docSchema)
    .optional()
    
}).strict();

export default setupSchema;