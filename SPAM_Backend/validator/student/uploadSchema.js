import {z} from 'zod';

const baseFields = z.object({
  message : z
    .string({ message : "Message must be a string"})
    .trim()
    .max(1000 , { message : "Message must be less than 1000 characters"})
    .optional()
    
});

const skillsSchema = z.object({
  category: z.literal("skills"),
  body : z.object({
    name : z
      .string({ message : "Skill name must be a string" })
      .trim()
      .max(50, { message : "field must be less than 50 characters"})
      .toLowerCase(), 
    
    topics : z
      .array(z
        .string({ message : "Technology must be an array of string" })
        .trim()
        .max(30 , { message : "Each technology must be less than 30 characters" })
        .toLowerCase()
        )
      .nonempty()
  })
});
    
const resultSchema = z.object({
  category: z.literal("result"),
  body: z.object({
    name : z
      .string({ message: "Result name must be a string" })
      .trim()
      .max(100, { message: "Result name must be less than 50 characters" })
      .toLowerCase(),
    
    r_no : z
      .coerce.string({ message: "Roll no must be a string" })
      .trim()
      .max(20, { message: "Roll no must be less than 20 characters" })
      .toLowerCase(),
    
    score : z
      .coerce.number({ message : "Score must be a numeric (in %)"})
      .gte(0 , { message : "Score must be greater than equal to 0%"})
      .lte(100 , { message : "Score must be less than equal to 100%"})
  })
});

const certificateSchema = z.object({
  category : z.literal("certificate"),
  body : z.object({
    name : z
      .string({ message : "Certificate name must be a string" })
      .trim()
      .max(100, { message : "Certificate name must be less than 50 characters"})
      .toLowerCase(), 
    
    c_id : z
      .coerce.string({ message : "ID must be a string" })
      .trim()
      .max(20, { message: "Certificate id must be less than 20 characters" })
      .toLowerCase()
  })
});

const projectSchema = z.object({
  category : z.literal("project"),
  body : z.object({
    name : z
      .string({ message : "Field must be a string" })
      .trim()
      .max(50, { message : "field must be less than 50 characters"})
      .toLowerCase(), 
    
    description : z
      .string({ message : "Description must be a string"})
      .trim()
      .max(1000 , { message : "Description must be less than 1000 characters"}), 
      
    technology : z
      .array(z
        .string({ message : "Technology must be an array of string" })
        .trim()
        .max(20 , { message : "Each technology must be less than 20 characters" })
        .toLowerCase()
        )
      .nonempty(), 
      
    url : z
      .string({ message : "URL must be a string" })
      .trim()
      .url({ message : "Proper url is required"})
      .optional()
  })
});

const internshipSchema = z.object({
  category : z.literal("internship"),
  body : z.object({
    field : z
      .string({ message : "Field must be a string" })
      .trim()
      .max(30, { message : "Field must be less than 30 characters"})
      .toLowerCase(), 
      
    company : z
      .string({ message : "Company name must be a string" })
      .trim()
      .max(50, { message : "Company name must be less than 50 characters"})
      .toLowerCase(), 
      
    duration : z
      .coerce.number({ message : "Duration must be a number (no of months)" })
      .nonnegative({ message : "Duration must be position" })
  })
});

const requestSchema = z.discriminatedUnion("category", [
  baseFields.merge(skillsSchema).strict(),
  baseFields.merge(resultSchema).strict(), 
  baseFields.merge(certificateSchema).strict(),
  baseFields.merge(projectSchema).strict(),
  baseFields.merge(internshipSchema).strict()
]);

export default requestSchema;