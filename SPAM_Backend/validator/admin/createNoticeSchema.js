import {z} from 'zod';

const roleSchema = z.union([
  z.tuple([z.literal("student")]),
  
  z.array(z
    .string()
    .regex(/^s[a-z]{2}\d{4,}$/i, { message : "Invalid student ID format" })
  )
  .nonempty(),

  z.tuple([
    z.array(z.enum(["1yr", "2yr", "3yr", "4yr"])).nonempty(),
    z.array(z.enum(["cs", "me", "ce", "ee"])).nonempty(),
    z.enum(["skilled", "none"]),
  ]),
] , { message : `Invalid role format. Must be one of:
       1) ["student"]
       2) ["scs0005", "sme0015", ...]
       3) [ [years], [branches], "skilled"|"none" ]`,
    }
);

const createNoticeSchema = z.object({
  category : z
    .enum(["general","exam","project","internship","job","event","update"] , { message : "This category not exist"}),
  
  for : roleSchema, 
    
  subject : z
    .string({ message : "Subject must be a string" })
    .trim()
    .max(100 , { message : "Subject must be less than 100 characters"}), 
  
  body : z
    .string({ message : "Body must be a string" })
    .trim()
    .max(2000 , { message : "body must be less than 2000 characters"}), 
  
  expire_date : z
    .coerce.date({ message : "Expire date should be in YYYY-MM-DD formate"})
    .min(new Date(), { message: "Date must be in the future" })
    
}).strict();

export default createNoticeSchema;