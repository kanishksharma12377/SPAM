# **SPAM Backend - Complete API & Database Documentation**

---

## **Table of Contents**
1. [API Endpoints Overview](#api-endpoints-overview)
2. [Authentication APIs](#authentication-apis)
3. [Admin APIs](#admin-apis)
4. [Student APIs](#student-apis)
5. [Database Collections](#database-collections)
6. [Data Flow Diagrams](#data-flow-diagrams)

---

## **API Endpoints Overview**

### **Base Configuration**
- **Base URL:** `http://localhost:3000`
- **Port:** 3000
- **Frontend Origins:** `http://localhost:5173`, `http://localhost:5174`
- **Authentication:** JWT Tokens (15-day expiry)
- **Cookie Name:** `authToken` (HTTP-only, strict SameSite)

### **API Route Structure**
```
/api/login                          [POST]    - User authentication
/api/logout                         [POST]    - User logout (authCheck required)
/api/admin/...                      [Multi]   - Admin routes
/api/...                            [Multi]   - Student routes
```

---

## **Authentication APIs**

### **1. User Login**
**Endpoint:** `POST /api/login`

**Request Body (JSON):**
```json
{
  "role": "student",              // or "admin"
  "username": "john_doe",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "login successful",
  "user": {
    "id": "s_id_or_a_id",          // Student ID or Admin ID
    "name": "John Doe",
    "role": ["student", "s_id_value", "1yr", "cs", "skilled"],
    "setup": true                   // Profile setup status
  }
}
```

**Response (Error - 400/404/500):**
```json
{
  "success": false,
  "message": "Invalid password / no user with following username / Invalid role / Server error",
  "error": "error message"
}
```

**Authentication Validation:**
- **Admin Login:** Query Admin collection by username
- **Student Login:** Query Login collection by username
- **Password Verification:** Argon2 validation
- **JWT Token:** Created with 15-day expiry, stored in httpOnly cookie

**User Payload Stored in Token:**
```
{
  id: "user_id",
  name: "user_name",
  role: ["student"/"admin", user_id, ...details],
  setup: boolean
}
```

---

### **2. User Logout**
**Endpoint:** `POST /api/logout`

**Authentication:** Required (authCheck middleware)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "logout successful"
}
```

**Response (Error - 401/500):**
```json
{
  "success": false,
  "message": "Unauthorized / Server error",
  "error": "error message"
}
```

---

## **Admin APIs**

### **Base Route:** `/api/admin`
**Middleware:** authCheck + admin role verification

---

### **ADMIN PROFILE MANAGEMENT**

#### **1. Get Admin Profile**
**Endpoint:** `GET /api/admin/profile`

**Authentication:** Admin role required

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "a_id": "admin_001",
    "name": "Admin Name",
    "contact": "9876543210",
    "gmail": "admin@gmail.com",
    "image": "/defaultProfile.png",
    "username": "admin_username",
    "role": "admin"
  }
}
```

#### **2. Edit Admin Profile**
**Endpoint:** `PATCH /api/admin/profile`

**Request Body (JSON):**
```json
{
  "name": "Updated Name",
  "contact": "9998887776",
  "image": "/path/to/image.jpg"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "profile is updated",
  "updatedData": { /* updated fields */ }
}
```

---

### **ADMIN STUDENT REGISTRATION & MANAGEMENT**

#### **1. Get All Registered Students**
**Endpoint:** `GET /api/admin/register`

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "s_id": "210001",
      "name": "john doe",
      "username": "john_doe",
      "role": ["student", "210001", "1yr", "cs", "skilled"]
    },
    ...
  ]
}
```

#### **2. Register New Student**
**Endpoint:** `POST /api/admin/register/new`

**Request Body (JSON):**
```json
{
  "s_id": "210045",
  "name": "jane smith",
  "username": "jane_smith",
  "password": "securepass123",
  "role1": "1yr",           // Class: "1yr", "2yr", "3yr", "4yr"
  "role2": "cs",            // Branch: "cs", "ce", "me", "ee"
  "role3": "skilled"        // Skill Status: "skilled", "none"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Student registered successfully"
}
```

**System Actions:**
- Creates Login record with hashed password (Argon2)
- Stores in Login collection: `{s_id, name, username, password, role}`
- Creates log entry: `{by: "teacher", s_id, type: "register", detail: {...}}`

#### **3. Edit Student Credentials**
**Endpoint:** `PATCH /api/admin/register/:s_id`

**Path Parameters:**
```
s_id: Student ID (e.g., "210045")
```

**Request Body (JSON):**
```json
{
  "password": "newpassword123",
  "role1": "2yr",
  "role2": "ce",
  "role3": "none"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "student credential updated"
}
```

#### **4. Unregister Student**
**Endpoint:** `DELETE /api/admin/register/:s_id`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "student is unregistered"
}
```

**System Actions:**
- Deletes from Login collection
- Deletes from Student collection
- Deletes all Verify records
- Creates log entry

---

### **ADMIN STUDENT RECORD MANAGEMENT**

#### **1. Get All Students Records**
**Endpoint:** `GET /api/admin/record`

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "s_id": "210001",
      "name": { "firstName": "john", "middleName": "", "lastName": "doe" },
      "gmail": "john@gmail.com",
      "contact": "9876543210",
      "dob": "2002-05-15T00:00:00.000Z",
      "age": 22,
      "gender": "male",
      "address": {...},
      "branch": "cs",
      "class": "1yr",
      ...
    },
    ...
  ]
}
```

#### **2. Get Specific Student Record**
**Endpoint:** `GET /api/admin/record/:s_id`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": { /* complete student document */ }
}
```

#### **3. Edit Student Record**
**Endpoint:** `PATCH /api/admin/record/:s_id`

**Request Body (JSON):**
```json
{
  "fatherName": "Updated Father Name",
  "motherName": "Updated Mother Name",
  "address": {
    "locality": "downtown",
    "city": "bangalore",
    "district": "bangalore",
    "state": "karnataka",
    "pincode": "560001"
  },
  "socialAccount": [
    {
      "name": "linkedin",
      "link": "https://linkedin.com/in/johndoe"
    }
  ]
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "record updated",
  "updatedData": { /* updated fields */ }
}
```

---

### **ADMIN ACHIEVEMENT VERIFICATION**

#### **1. Get All Verification Requests**
**Endpoint:** `GET /api/admin/upload`

**Query Parameters (Optional):**
```
?status=pending          // Filter by status: "pending", "accepted", "rejected"
?s_id=210001            // Filter by student ID
?category=skills        // Filter by category
```

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "v_id": 1,
      "s_id": "210001",
      "category": "skills",                    // "skills", "result", "certificate", "project", "internship"
      "body": {
        "skill_name": "Python",
        "proficiency": "Advanced"
      },
      "message": "Python programming skill",
      "proof": "/uploads/210001_python_cert.pdf",
      "status": "pending",                     // "pending", "accepted", "rejected"
      "feedback": null,
      "creation_date": "2025-04-09T10:30:00.000Z"
    },
    ...
  ]
}
```

#### **2. Verify/Approve Achievement Request**
**Endpoint:** `PATCH /api/admin/upload/:v_id`

**Path Parameters:**
```
v_id: Verification ID (e.g., 1)
```

**Request Body (JSON):**
```json
{
  "status": "accepted",                    // or "rejected"
  "feedback": "Excellent work! Verified and approved."
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "verification request accepted"
}
```

**System Actions:**
- Updates Verify document: `{status, feedback}`
- Creates log entry: `{by: "teacher", s_id, type: "update", detail: {v_id, status}}`

#### **3. Get Proof File**
**Endpoint:** `GET /api/admin/upload/proof/:v_id`

**Response:** Returns the file (PDF, image, etc.)

---

### **ADMIN NOTICE MANAGEMENT**

#### **1. Get All Notices**
**Endpoint:** `GET /api/admin/notice`

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "n_id": 1,
      "category": "general",            // "general", "exam", "project", "internship", "job", "event", "update"
      "for": ["student"],               // Recipient list
      "subject": "Campus Placement Notice",
      "body": "We are pleased to announce...",
      "issue_date": "2025-04-09T00:00:00.000Z",
      "expire_date": "2025-05-09T00:00:00.000Z"
    },
    ...
  ]
}
```

#### **2. Create Notice**
**Endpoint:** `POST /api/admin/notice`

**Request Body (JSON):**
```json
{
  "category": "job",
  "for": ["student"],
  "subject": "Google Internship Opportunity",
  "body": "Google is hiring interns for summer 2025...",
  "expire_date": "2025-06-30T00:00:00.000Z"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "notice added successfully",
  "noticeId": 5
}
```

**System Actions:**
- Auto-increments n_id via Counter collection
- Stores creation time automatically
- Creates log entry

#### **3. Delete Notice**
**Endpoint:** `DELETE /api/admin/notice/:n_id`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "notice is deleted"
}
```

---

### **ADMIN ACTIVITY LOGS**

#### **1. Get All Logs**
**Endpoint:** `GET /api/admin/logs`

**Query Parameters (Optional):**
```
?by=teacher                  // Filter by: "teacher" or "student"
?type=register              // Filter by type: "register", "unregister", "request", "update", "notice", "setup"
?s_id=210001               // Filter by student ID
?startDate=2025-04-01      // Filter by date range
?endDate=2025-04-30
```

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 234,
  "data": [
    {
      "l_id": 1,
      "by": "teacher",
      "s_id": "210001",
      "type": "register",                    // Type of action
      "time": "2025-04-09T10:30:00.000Z",
      "detail": {
        "message": "Teacher register a student",
        "data": {
          "s_id": "210001",
          "name": "john doe",
          "username": "john_doe"
        }
      }
    },
    ...
  ]
}
```

---

## **Student APIs**

### **Base Route:** `/api`
**Middleware:** authCheck

---

### **STUDENT PROFILE MANAGEMENT**

#### **1. Get Student Profile**
**Endpoint:** `GET /api/profile`

**Authentication:** Student role required

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "s_id": "210001",
    "name": {
      "firstName": "john",
      "middleName": "",
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
    "profile": "some bio text",
    "socialAccount": [
      {
        "name": "linkedin",
        "link": "https://linkedin.com/in/johndoe"
      }
    ],
    "document": [
      {
        "name": "aadhar",
        "doc_no": "123456789012",
        "image": "/uploads/210001_aadhar.pdf"
      }
    ]
  }
}
```

#### **2. Edit Student Profile**
**Endpoint:** `PATCH /api/profile`

**Request Body (JSON):**
```json
{
  "fatherName": "new father name",
  "motherName": "new mother name",
  "image": "/new/image/path.jpg",
  "profile": "Updated bio/description",
  "socialAccount": [
    {
      "name": "github",
      "link": "https://github.com/johndoe"
    }
  ],
  "document": [
    {
      "name": "passport",
      "doc_no": "M987654321",
      "image": "/uploads/210001_passport.pdf"
    }
  ]
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "profile is updated",
  "updatedData": { /* updated fields */ }
}
```

---

### **STUDENT RECORD (PROFILE SETUP)**

#### **1. Setup Student Record (First Time)**
**Endpoint:** `POST /api/record/setup`

**Request Body (JSON):**
```json
{
  "dob": "2002-05-15",
  "gender": "male",
  "category": "gen",
  "gmail": "john@gmail.com",
  "contact": "9876543210",
  "address": {
    "locality": "downtown",
    "city": "bangalore",
    "district": "bangalore",
    "state": "karnataka",
    "pincode": "560001"
  }
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Your record has been added"
}
```

**System Actions:**
- Creates Student document with s_id
- Auto-calculates age from DOB
- Creates log entry: `{by: "student", type: "setup"}`

#### **2. Get Student Record**
**Endpoint:** `GET /api/record`

**Response (Success - 200):**
```json
{
  "success": true,
  "data": { /* complete student document */ }
}
```

#### **3. Edit Student Record**
**Endpoint:** `PATCH /api/record`

**Request Body (JSON):**
```json
{
  "dob": "2002-05-15",
  "contact": "9998887776",
  "address": {
    "locality": "uptown",
    "city": "bangalore",
    "district": "bangalore",
    "state": "karnataka",
    "pincode": "560002"
  }
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "record is updated",
  "updatedData": { /* updated fields */ }
}
```

---

### **STUDENT ACHIEVEMENT SUBMISSION**

#### **1. Get Submission Requests**
**Endpoint:** `GET /api/upload`

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "v_id": 1,
      "s_id": "210001",
      "category": "skills",
      "body": { /* achievement details */ },
      "message": "Python skill certification",
      "proof": "/uploads/210001_python.pdf",
      "status": "pending",                    // pending/accepted/rejected
      "feedback": null,
      "creation_date": "2025-04-09T10:30:00.000Z"
    },
    ...
  ]
}
```

#### **2. Submit Achievement for Verification**
**Endpoint:** `POST /api/upload`

**Multipart Form Data:**
```
category: "skills"          // skills, result, certificate, project, internship
body: {json}               // Details of achievement (JSON stringified)
message: "Python skill"    // Achievement message/title
proof: <file>              // File upload (PDF, image, etc.)
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: authToken=..." \
  -F "category=skills" \
  -F "body={\"skill_name\":\"Python\",\"proficiency\":\"Advanced\"}" \
  -F "message=Python Programming" \
  -F "proof=@certificate.pdf"
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "request submitted successfully",
  "requestId": 1
}
```

**System Actions:**
- Stores file in `/public/uploads/` directory
- Creates Verify document with auto-incremented v_id
- Creates log entry: `{by: "student", type: "request"}`

#### **3. Delete Submission Request**
**Endpoint:** `DELETE /api/upload/:v_id`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "request is deleted"
}
```

#### **4. Get Proof File**
**Endpoint:** `GET /api/upload/proof/:v_id`

**Response:** Returns the uploaded file

---

### **STUDENT NOTICE VIEW**

#### **1. Get All Notices**
**Endpoint:** `GET /api/notice`

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "n_id": 1,
      "category": "job",
      "for": ["student"],
      "subject": "Google Internship Opportunity",
      "body": "Google is hiring interns for summer 2025...",
      "issue_date": "2025-04-09T00:00:00.000Z",
      "expire_date": "2025-06-30T00:00:00.000Z"
    },
    ...
  ]
}
```

---

### **STUDENT ACTIVITY LOGS**

#### **1. Get Personal Logs**
**Endpoint:** `GET /api/logs`

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "l_id": 1,
      "by": "student",
      "s_id": "210001",
      "type": "setup",
      "time": "2025-04-09T10:30:00.000Z",
      "detail": {
        "message": "Student created profile"
      }
    },
    ...
  ]
}
```

---

## **Database Collections**

### **1. Login Collection**
**Purpose:** Store student login credentials

**Schema:**
```javascript
{
  s_id: String,              // Student ID (unique, indexed)
  name: String,              // Student name
  username: String,          // Username (unique, lowercase)
  password: String,          // Hashed password (Argon2)
  role: Array,               // [role, s_id, class, branch, skill_status]
                             // Example: ["student", "210001", "1yr", "cs", "skilled"]
  _id: ObjectId,
  __v: Number
}
```

**Indexes:** s_id, username

---

### **2. Admin Collection**
**Purpose:** Store admin user credentials

**Schema:**
```javascript
{
  a_id: String,              // Admin ID (unique, immutable)
  name: String,              // Admin name (lowercase)
  contact: String,           // Contact number (10 digits)
  gmail: String,             // Email (unique, lowercase)
  image: String,             // Profile image path (default: /defaultProfile.png)
  username: String,          // Username (unique, lowercase)
  password: String,          // Hashed password (Argon2)
  role: String,              // Always "admin" (enum, immutable)
  _id: ObjectId,
  __v: Number
}
```

**Indexes:** a_id, username, gmail

---

### **3. Student Collection**
**Purpose:** Store complete student profile information

**Schema:**
```javascript
{
  s_id: String,              // Student ID (unique, indexed, lowercase)
  name: {
    firstName: String,       // Required, lowercase
    middleName: String,      // Optional, lowercase
    lastName: String         // Optional, lowercase
  },
  fatherName: String,        // Father's name (lowercase)
  motherName: String,        // Mother's name (lowercase)
  dob: Date,                 // Date of birth (required)
  age: Number,               // Age (required, auto-calculated)
  gender: String,            // Enum: "male", "female", "other" (required)
  category: String,          // Enum: "gen", "obc", "st", "sc"
  image: String,             // Profile image path (default: /defaultProfile.png)
  gmail: String,             // Email (unique, lowercase, required)
  contact: String,           // Phone number (10 digits, required)
  address: {
    locality: String,        // Locality (lowercase)
    city: String,            // City (required, lowercase)
    district: String,        // District (required, lowercase)
    state: String,           // State (required, lowercase)
    pincode: String          // Pincode (6 digits, required)
  },
  class: String,             // Enum: "1yr", "2yr", "3yr", "4yr" (required)
  branch: String,            // Enum: "cs", "ce", "me", "ee" (required)
  profile: String,           // Bio/description (lowercase)
  socialAccount: [{
    name: String,            // LinkedIn, GitHub, etc. (lowercase)
    link: String,            // Valid URL (regex validated)
    _id: false
  }],
  document: [{
    name: String,            // Document type: aadhar, passport, etc. (lowercase)
    doc_no: String,          // Document number (lowercase)
    image: String,           // Document image path
    _id: false
  }],
  _id: ObjectId,
  __v: Number
}
```

**Indexes:** s_id

---

### **4. Verify Collection**
**Purpose:** Store achievement verification requests

**Schema:**
```javascript
{
  v_id: Number,              // Verification ID (unique, auto-increment, immutable)
  s_id: String,              // Student ID (lowercase)
  category: String,          // Enum: "skills", "result", "certificate", "project", "internship"
  body: Object,              // Achievement details (flexible JSON object)
                             // Example: {skill_name: "Python", proficiency: "Advanced"}
  message: String,           // Achievement title/message (lowercase)
  proof: String,             // Path to uploaded proof file (required)
  status: String,            // Enum: "pending", "accepted", "rejected" (default: "pending")
  feedback: String,          // Admin feedback (lowercase)
  creation_date: Date,       // Timestamp (default: current date)
  _id: ObjectId,
  __v: Number
}
```

**Auto-Increment Logic:**
- Counter collection tracks v_id
- On save: `$inc: {v_id: 1}`, `{upsert: true}`

---

### **5. Notice Collection**
**Purpose:** Store announcements and notices

**Schema:**
```javascript
{
  n_id: Number,              // Notice ID (unique, auto-increment, immutable)
  category: String,          // Enum: "general", "exam", "project", "internship", "job", "event", "update"
  for: Array,                // Recipients list (default: ["student"])
  subject: String,           // Notice subject (required)
  body: String,              // Notice content (required)
  issue_date: Date,          // Issue date (default: current date)
  expire_date: Date,         // Expiration date (optional)
  _id: ObjectId,
  __v: Number
}
```

**Auto-Increment Logic:** Same as Verify collection

---

### **6. Logs Collection**
**Purpose:** Comprehensive activity audit trail

**Schema:**
```javascript
{
  l_id: Number,              // Log ID (unique, auto-increment, immutable)
  by: String,                // Enum: "teacher", "student"
  s_id: String,              // Student ID (default: null, lowercase)
  type: String,              // Enum: "register", "unregister", "request", "update", "notice", "setup"
  time: Date,                // Timestamp (default: current date)
  detail: Object,            // Flexible object with action details
                             // Example: {message: "...", data: {...}}
  _id: ObjectId,
  __v: Number
}
```

---

### **7. Counter Collection**
**Purpose:** Store auto-increment counters for v_id, n_id, l_id

**Schema:**
```javascript
{
  name: String,              // "autoInc" (unique)
  v_id: Number,              // Verification counter
  n_id: Number,              // Notice counter
  l_id: Number,              // Logs counter
  _id: ObjectId,
  __v: Number
}
```

**Increment Logic:**
```javascript
Counter.findOneAndUpdate(
  { name: "autoInc" },
  { $inc: { v_id: 1 } },    // Increment relevant counter
  { new: true, upsert: true }
);
```

---

## **Data Flow Diagrams**

### **1. Student Registration Flow**

```
Admin Panel
    ↓
POST /api/admin/register/new
    ↓
Validate with registerSchema (Zod)
    ↓
Hash password with Argon2
    ↓
[Check] Student already registered?
    └─→ No: Continue
    └─→ Yes: Return 400 error
    ↓
Save to Login Collection:
  {s_id, name, username, password, role}
    ↓
Create Log Entry
    ↓
Response: 201 (Success)
```

**Collections Modified:** Login, Logs
**Collections Queried:** Login

---

### **2. Student Profile Setup Flow**

```
Student Portal (First Login)
    ↓
Student completes profile information
    ↓
POST /api/record/setup
    ↓
Validate with setupSchema (Zod)
    ↓
[Check] Account already setup?
    └─→ Yes: Return 403 error
    └─→ No: Continue
    ↓
Calculate age from DOB
    ↓
Save to Student Collection:
  {s_id, name, dob, age, gender, address, ...}
    ↓
Create Log Entry: {type: "setup"}
    ↓
Response: 201 (Success)
    ↓
Update JWT token: setup = true
```

**Collections Modified:** Student, Logs
**Collections Queried:** Student

---

### **3. Achievement Submission Flow**

```
Student Portal
    ↓
Select category (skills/certificate/project/internship/result)
    ↓
Enter achievement details
    ↓
Upload proof file
    ↓
POST /api/upload (multipart/form-data)
    ↓
Validate file and data
    ↓
Save file to /public/uploads/
    ↓
Save to Verify Collection:
  {v_id (auto-inc), s_id, category, body, message, proof, status: "pending"}
    ↓
Create Log Entry: {type: "request"}
    ↓
Increment Counter: v_id += 1
    ↓
Response: 201 (Success)
```

**Collections Modified:** Verify, Logs, Counter
**File System:** /public/uploads/

---

### **4. Achievement Verification Flow**

```
Admin Portal → Pending Submissions
    ↓
GET /api/admin/upload?status=pending
    ↓
Retrieve from Verify Collection
    ↓
Admin reviews submission
    ↓
Admin clicks Approve/Reject
    ↓
PATCH /api/admin/upload/:v_id
  {status: "accepted"/"rejected", feedback: "..."}
    ↓
Update Verify Document:
  {status, feedback}
    ↓
Create Log Entry: {type: "update", detail: {v_id, status}}
    ↓
Response: 201 (Success)
    ↓
[Optional] Send notification to Student
```

**Collections Modified:** Verify, Logs
**Collections Queried:** Verify, Student

---

### **5. Activity Logging Flow**

```
Any Action (Register, Verify, Update, etc.)
    ↓
Create Log Entry:
  {l_id (auto-inc), by, s_id, type, time, detail}
    ↓
Save to Logs Collection
    ↓
Increment Counter: l_id += 1
```

**Collections Modified:** Logs, Counter

---

## **API Response Status Codes**

| Code | Meaning | Common Scenarios |
|---|---|---|
| **200** | OK | Successful GET, successful logout |
| **201** | Created | Successful POST, successful PATCH (update) |
| **400** | Bad Request | Invalid input, validation error, already setup |
| **401** | Unauthorized | Missing auth token, invalid token, role mismatch |
| **403** | Forbidden | Account already setup, not allowed action |
| **404** | Not Found | User/document not found, no data to retrieve |
| **500** | Server Error | Database error, unexpected error |

---

## **Authentication Flow**

### **JWT Token Structure**
```javascript
{
  id: "user_id",                    // s_id or a_id
  name: "user_name",
  role: ["student", s_id, year, branch, skill] || "admin",
  setup: true/false,                // Profile setup status
  iat: timestamp,
  exp: timestamp + 15 days          // 15-day expiry
}
```

### **Cookie Configuration**
```
Name: authToken
HttpOnly: true (not accessible via JavaScript)
SameSite: strict (CSRF protection)
MaxAge: 15 days
Secure: (recommended for production)
```

### **Middleware Chain**
```
authCheck
  ↓
Verify JWT from cookie
  ↓
Decode token payload
  ↓
Attach user object to req.user
  ↓
Next (or return 401 if invalid)
```

---

## **File Upload Configuration**

**Upload Directory:** `/public/uploads/`

**File Naming:** Automatic (multer default or custom)

**Allowed Types:** Images (jpg, jpeg, png, gif, webp), PDF, Documents

**Size Limit:** Variable (check multer configuration)

**Storage:** Local file system

---

## **Validation & Security**

### **Password Hashing**
- Algorithm: Argon2
- Cost Factor: 12
- Applied During: Student registration, admin updates

### **Input Validation**
- Validator: Zod Schema
- Applied to: All POST/PATCH requests
- Validation Types: String format, enum, regex (email, phone, URL)

### **Data Sanitization**
- Lowercase normalization for text fields
- Trim whitespace
- Pattern matching for phone, email, pincode

### **Authorization**
- Role-based: Admin vs Student
- Token verification: JWT
- Middleware: authCheck, setupCheck

---

## **Key Implementation Notes**

1. **Auto-Increment IDs:** v_id, n_id, l_id use Counter collection pattern
2. **Role Array:** Student's role field stores [role, s_id, class, branch, skill_status]
3. **File Storage:** Uploaded proofs stored in /public/uploads/
4. **Age Calculation:** Auto-calculated from DOB at profile setup
5. **LOG Tracking:** Every significant action creates a log entry
6. **Setup Check:** Students must setup profile before accessing most features
7. **Token Expiry:** 15 days for both access and cookie

---

**Document Version:** 1.0  
**Last Updated:** April 9, 2025  
**Backend Server:** Node.js + Express  
**Database:** MongoDB  
**Framework:** REST API
