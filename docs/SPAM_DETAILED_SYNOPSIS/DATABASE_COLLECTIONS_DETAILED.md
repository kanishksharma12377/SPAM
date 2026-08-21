# **SPAM Backend - Database Collections & Data Storage Reference**

## **Complete Collection Schemas**

---

## **1. LOGIN COLLECTION**
**Purpose:** Store student authentication credentials  
**Document Count:** One per registered student  
**Indexes:** s_id (unique), username (unique)

### **Schema:**
```javascript
{
  _id: ObjectId,
  s_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
    // Example: "210001"
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
    // Example: "john doe"
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
    // Example: "john_doe"
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true
    // Hashed with Argon2 (cost factor: 12)
  },
  role: {
    type: [String],
    required: true,
    // Array Format: ["student", s_id, class, branch, skill_status]
    // Example: ["student", "210001", "1yr", "cs", "skilled"]
    validate: {
      validator: function(arr) {
        // Must have exactly 5 elements
        // First element: "student"
        // Second element: matches s_id
        // Third element: valid year ("1yr", "2yr", "3yr", "4yr")
        // Fourth element: valid branch ("cs", "ce", "me", "ee")
        // Fifth element: valid skill level ("skilled", "none")
        return arr.length === 5;
      }
    }
  },
  __v: Number
}
```

### **Data Storage Example:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "s_id": "210001",
  "name": "john doe",
  "username": "john_doe",
  "password": "$argon2id$v=19$m=65536,t=3,p=4$...",
  "role": ["student", "210001", "1yr", "cs", "skilled"],
  "__v": 0
}
```

### **Operations:**
- **Create:** On admin student registration
- **Read:** During student login
- **Update:** When admin resets credentials
- **Delete:** When student is unregistered

---

## **2. ADMIN COLLECTION**
**Purpose:** Store administrator credentials and profile  
**Document Count:** One per admin user  
**Indexes:** a_id (unique), username (unique), gmail (unique)

### **Schema:**
```javascript
{
  _id: ObjectId,
  a_id: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
    lowercase: true,
    trim: true
    // Example: "admin_001"
  },
  name: {
    type: String,
    lowercase: true,
    trim: true
    // Example: "admin user"
  },
  contact: {
    type: String,
    trim: true,
    match: /^[0-9]{10}$/
    // Example: "9876543210"
  },
  gmail: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[\w.-]+@gmail\.com$/
    // Example: "admin@gmail.com"
  },
  image: {
    type: String,
    default: "/defaultProfile.png",
    trim: true,
    match: /\.(jpg|jpeg|png|gif|webp)$/i
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
    // Example: "admin_username"
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true
    // Hashed with Argon2
  },
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
    immutable: true
  },
  __v: Number
}
```

### **Data Storage Example:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "a_id": "admin_001",
  "name": "admin user",
  "contact": "9876543210",
  "gmail": "admin@gmail.com",
  "image": "/defaultProfile.png",
  "username": "admin_username",
  "password": "$argon2id$v=19$m=65536,t=3,p=4$...",
  "role": "admin",
  "__v": 0
}
```

---

## **3. STUDENT COLLECTION**
**Purpose:** Store complete student profile information  
**Document Count:** One per student (after profile setup)  
**Indexes:** s_id (unique)

### **Schema:**
```javascript
{
  _id: ObjectId,
  
  // Basic Identification
  s_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
    // Example: "210001"
  },
  
  // Name Information
  name: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    middleName: {
      type: String,
      trim: true,
      lowercase: true
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  
  // Parent Information
  fatherName: {
    type: String,
    trim: true,
    lowercase: true
  },
  motherName: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Personal Details
  dob: {
    type: Date,
    required: true
    // Example: "2002-05-15T00:00:00.000Z"
  },
  age: {
    type: Number,
    required: true
    // Auto-calculated from DOB using calculateAge utility
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"]
  },
  category: {
    type: String,
    enum: ["gen", "obc", "st", "sc"]
    // Reserved category for admission
  },
  
  // Profile Picture
  image: {
    type: String,
    default: "/defaultProfile.png",
    trim: true,
    match: /\.(jpg|jpeg|png|gif|webp)$/i
  },
  
  // Contact Information
  gmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[\w.-]+@gmail\.com$/
  },
  contact: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/
  },
  
  // Address Information
  address: {
    locality: {
      type: String,
      lowercase: true
    },
    city: {
      type: String,
      required: true,
      lowercase: true
    },
    district: {
      type: String,
      required: true,
      lowercase: true
    },
    state: {
      type: String,
      required: true,
      lowercase: true
    },
    pincode: {
      type: String,
      required: true,
      match: /^[0-9]{6}$/
    }
  },
  
  // Academic Information
  class: {
    type: String,
    required: true,
    enum: ["1yr", "2yr", "3yr", "4yr"]
  },
  branch: {
    type: String,
    required: true,
    enum: ["cs", "ce", "me", "ee"]
  },
  
  // Portfolio
  profile: {
    type: String,
    trim: true,
    lowercase: true
    // Bio/About me section
  },
  
  // Social Media Links
  socialAccount: [{
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
      // Example: "linkedin", "github"
    },
    link: {
      type: String,
      required: true,
      match: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/
    },
    _id: false
  }],
  
  // Documents
  document: [{
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
      // Example: "aadhar", "passport"
    },
    doc_no: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    image: {
      type: String,
      trim: true,
      match: /\.(jpg|jpeg|png|gif|webp)$/i
    },
    _id: false
  }],
  
  __v: Number
}
```

### **Data Storage Example:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "s_id": "210001",
  "name": {
    "firstName": "john",
    "middleName": "kumar",
    "lastName": "doe"
  },
  "fatherName": "father name",
  "motherName": "mother name",
  "dob": "2002-05-15T00:00:00.000Z",
  "age": 22,
  "gender": "male",
  "category": "gen",
  "image": "/uploads/210001_profile.jpg",
  "gmail": "john@gmail.com",
  "contact": "9876543210",
  "address": {
    "locality": "downtown",
    "city": "bangalore",
    "district": "bangalore",
    "state": "karnataka",
    "pincode": "560001"
  },
  "class": "1yr",
  "branch": "cs",
  "profile": "aspiring software engineer",
  "socialAccount": [
    {
      "name": "linkedin",
      "link": "https://linkedin.com/in/johndoe"
    },
    {
      "name": "github",
      "link": "https://github.com/johndoe"
    }
  ],
  "document": [
    {
      "name": "aadhar",
      "doc_no": "123456789012",
      "image": "/uploads/210001_aadhar.pdf"
    }
  ],
  "__v": 0
}
```

---

## **4. VERIFY COLLECTION**
**Purpose:** Store achievement verification requests from students  
**Document Count:** Grows with each submission  
**Indexes:** None (auto-increment v_id is unique)

### **Schema:**
```javascript
{
  _id: ObjectId,
  
  v_id: {
    type: Number,
    unique: true,
    immutable: true
    // Auto-incremented by Counter collection
  },
  
  s_id: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
    // Student ID who submitted
  },
  
  category: {
    type: String,
    required: true,
    enum: ["skills", "result", "certificate", "project", "internship"]
    // Type of achievement
  },
  
  body: {
    type: Object,
    required: true
    // Flexible schema - stores achievement-specific data
    // Example for skills: {skill_name: "Python", proficiency: "Advanced"}
    // Example for project: {title: "E-commerce", description: "...", github_link: "..."}
  },
  
  message: {
    type: String,
    trim: true
    // Achievement title or message
  },
  
  proof: {
    type: String,
    required: true,
    trim: true
    // Path to uploaded proof file
    // Example: "/uploads/210001_python_cert.pdf"
  },
  
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "rejected"]
  },
  
  feedback: {
    type: String,
    trim: true
    // Admin's feedback (if rejected)
  },
  
  creation_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  
  __v: Number
}
```

### **Data Storage Examples:**

**Example 1: Skills Submission**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "v_id": 1,
  "s_id": "210001",
  "category": "skills",
  "body": {
    "skill_name": "Python",
    "proficiency": "Advanced",
    "years_of_experience": "3"
  },
  "message": "Python programming skill",
  "proof": "/uploads/210001_python_cert.pdf",
  "status": "pending",
  "feedback": null,
  "creation_date": "2025-04-09T10:30:00.000Z",
  "__v": 0
}
```

**Example 2: Project Submission**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "v_id": 2,
  "s_id": "210001",
  "category": "project",
  "body": {
    "project_name": "E-commerce Platform",
    "description": "Full-stack MERN application",
    "start_date": "2025-01-01",
    "end_date": "2025-03-31",
    "github_link": "https://github.com/johndoe/ecommerce"
  },
  "message": "E-commerce Platform Project",
  "proof": "/uploads/210001_project_report.pdf",
  "status": "accepted",
  "feedback": "Great project! Well-documented and implemented.",
  "creation_date": "2025-04-08T14:20:00.000Z",
  "__v": 0
}
```

**Example 3: Certificate Submission**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439016"),
  "v_id": 3,
  "s_id": "210001",
  "category": "certificate",
  "body": {
    "certificate_name": "AWS Certified Cloud Practitioner",
    "issuing_organization": "Amazon Web Services",
    "issue_date": "2025-03-15",
    "credential_id": "AWS-12345-67890"
  },
  "message": "AWS Cloud Practitioner Certification",
  "proof": "/uploads/210001_aws_cert.pdf",
  "status": "rejected",
  "feedback": "Certificate expires before portfolio submission deadline. Please resubmit after renewal.",
  "creation_date": "2025-04-05T09:15:00.000Z",
  "__v": 0
}
```

---

## **5. NOTICE COLLECTION**
**Purpose:** Store system announcements and notifications  
**Document Count:** Grows with each notice creation  
**Indexes:** None (auto-increment n_id is unique)

### **Schema:**
```javascript
{
  _id: ObjectId,
  
  n_id: {
    type: Number,
    unique: true,
    immutable: true
    // Auto-incremented by Counter collection
  },
  
  category: {
    type: String,
    required: true,
    enum: ["general", "exam", "project", "internship", "job", "event", "update"]
  },
  
  for: {
    type: [],
    required: true,
    default: ["student"]
    // Recipient roles: ["student"], ["admin"], or both
  },
  
  subject: {
    type: String,
    required: true
    // Notice title
  },
  
  body: {
    type: String,
    required: true
    // Notice content/message
  },
  
  issue_date: {
    type: Date,
    default: Date.now()
    // When notice was created
  },
  
  expire_date: {
    type: Date
    // When notice expires (optional)
  },
  
  __v: Number
}
```

### **Data Storage Examples:**

**Example 1: Job Notice**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439017"),
  "n_id": 1,
  "category": "job",
  "for": ["student"],
  "subject": "Google India - Software Engineer Internship",
  "body": "Google is hiring software engineer interns for summer 2025. Minimum CGPA: 7.0. Visit our portal for application link. Deadline: 15th May 2025.",
  "issue_date": "2025-04-09T00:00:00.000Z",
  "expire_date": "2025-05-15T23:59:59.000Z",
  "__v": 0
}
```

**Example 2: Exam Notice**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439018"),
  "n_id": 2,
  "category": "exam",
  "for": ["student"],
  "subject": "Mid-Semester Examination Schedule",
  "body": "Mid-semester exams will be held from 1st May to 15th May 2025. Prepare your time table and study accordingly. All exam centers have been posted on the notice board.",
  "issue_date": "2025-04-09T10:00:00.000Z",
  "expire_date": "2025-05-31T00:00:00.000Z",
  "__v": 0
}
```

---

## **6. LOGS COLLECTION**
**Purpose:** Maintain comprehensive audit trail of all system activities  
**Document Count:** Grows continuously with system usage  
**Indexes:** None (auto-increment l_id is unique)

### **Schema:**
```javascript
{
  _id: ObjectId,
  
  l_id: {
    type: Number,
    unique: true,
    immutable: true
    // Auto-incremented by Counter collection
  },
  
  by: {
    type: String,
    required: true,
    enum: ["teacher", "student"]
    // Who performed the action (from Login/Admin role)
  },
  
  s_id: {
    type: String,
    default: null,
    lowercase: true,
    trim: true
    // Student ID (null for admin actions without student context)
  },
  
  type: {
    type: String,
    required: true,
    enum: ["register", "unregister", "request", "update", "notice", "setup"]
    // Type of action performed
  },
  
  time: {
    type: Date,
    default: Date.now()
    // When action occurred
  },
  
  detail: {
    type: Object,
    default: {}
    // Flexible object storing action-specific details
  },
  
  __v: Number
}
```

### **Data Storage Examples:**

**Example 1: Student Registration Log**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439019"),
  "l_id": 1,
  "by": "teacher",
  "s_id": "210001",
  "type": "register",
  "time": "2025-04-09T10:15:00.000Z",
  "detail": {
    "message": "Teacher register a student",
    "data": {
      "s_id": "210001",
      "name": "john doe",
      "username": "john_doe",
      "class": "1yr",
      "branch": "cs"
    }
  },
  "__v": 0
}
```

**Example 2: Profile Setup Log**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439020"),
  "l_id": 2,
  "by": "student",
  "s_id": "210001",
  "type": "setup",
  "time": "2025-04-09T11:30:00.000Z",
  "detail": {
    "message": "Student completed profile setup",
    "data": {
      "gmail": "john@gmail.com",
      "contact": "9876543210",
      "city": "bangalore"
    }
  },
  "__v": 0
}
```

**Example 3: Achievement Request Log**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439021"),
  "l_id": 3,
  "by": "student",
  "s_id": "210001",
  "type": "request",
  "time": "2025-04-09T14:45:00.000Z",
  "detail": {
    "message": "Student submitted achievement for verification",
    "v_id": 1,
    "category": "skills",
    "proof_file": "210001_python_cert.pdf"
  },
  "__v": 0
}
```

**Example 4: Achievement Verification Log**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439022"),
  "l_id": 4,
  "by": "teacher",
  "s_id": "210001",
  "type": "update",
  "time": "2025-04-09T15:20:00.000Z",
  "detail": {
    "message": "Admin reviewed and approved achievement",
    "v_id": 1,
    "previous_status": "pending",
    "new_status": "accepted",
    "feedback": "Great certification!"
  },
  "__v": 0
}
```

**Example 5: Notice Creation Log**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439023"),
  "l_id": 5,
  "by": "teacher",
  "s_id": null,
  "type": "notice",
  "time": "2025-04-09T16:00:00.000Z",
  "detail": {
    "message": "Admin created and published notice",
    "n_id": 1,
    "category": "job",
    "subject": "Google India Internship"
  },
  "__v": 0
}
```

---

## **7. COUNTER COLLECTION**
**Purpose:** Maintain auto-increment counters for v_id, n_id, l_id  
**Document Count:** Single document  
**Indexes:** name (unique)

### **Schema:**
```javascript
{
  _id: ObjectId,
  
  name: {
    type: String,
    unique: true
    // Fixed value: "autoInc"
  },
  
  v_id: {
    type: Number,
    default: 0
    // Verification request counter
  },
  
  n_id: {
    type: Number,
    default: 0
    // Notice counter
  },
  
  l_id: {
    type: Number,
    default: 0
    // Logs counter
  },
  
  __v: Number
}
```

### **Data Storage Example:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439024"),
  "name": "autoInc",
  "v_id": 150,
  "n_id": 25,
  "l_id": 500,
  "__v": 0
}
```

### **Increment Logic:**
```javascript
// When creating new Verify document
Counter.findOneAndUpdate(
  { name: "autoInc" },
  { $inc: { v_id: 1 } },
  { new: true, upsert: true }
);

// When creating new Notice document
Counter.findOneAndUpdate(
  { name: "autoInc" },
  { $inc: { n_id: 1 } },
  { new: true, upsert: true }
);

// When creating new Log entry
Counter.findOneAndUpdate(
  { name: "autoInc" },
  { $inc: { l_id: 1 } },
  { new: true, upsert: true }
);
```

---

## **Data Storage Locations**

### **File Upload Storage**
**Directory:** `/public/uploads/`

**File Naming Convention:**
```
{s_id}_{document_type}_{timestamp}.{extension}
Example: 210001_python_cert.pdf
         210001_project_report.docx
         210001_aadhar.jpg
```

**Supported Formats:**
- Images: .jpg, .jpeg, .png, .gif, .webp
- Documents: .pdf, .doc, .docx
- Archives: (configurable)

---

## **Data Relationships**

### **Query Relationships**

**1. Student to Verify (1:Many)**
```javascript
// Get all achievements for a student
db.verify.find({ s_id: "210001" })
```

**2. Student to Student Record (1:1)**
```javascript
// Get full profile for a student
db.student.findOne({ s_id: "210001" })
```

**3. Student to Login (1:1)**
```javascript
// Get login credentials
db.login.findOne({ s_id: "210001" })
```

**4. Student to Logs (1:Many)**
```javascript
// Get activity history
db.logs.find({ s_id: "210001" })
```

---

## **Key Data Storage Characteristics**

1. **Normalization:** Separate Login and Student collections to segregate auth from profile data
2. **Flexibility:** body field in Verify allows dynamic achievement structures
3. **Audit Trail:** Comprehensive logging in Logs collection
4. **Auto-Increment:** Counter pattern for v_id, n_id, l_id
5. **Data Validation:** Zod schema validation on backend before storage
6. **Indexing:** Strategic indexes on s_id, username for query optimization
7. **Immutability:** Certain fields (a_id, role) are immutable after creation
8. **Default Values:** Image paths, timestamps auto-populated
9. **Relationships:** Foreign key references via s_id, a_id fields
10. **File Storage:** Separate from database, referenced by path strings

---

**Document Version:** 1.0  
**Last Updated:** April 9, 2025  
**Database:** MongoDB  
**ORM:** Mongoose.js
