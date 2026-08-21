# **SPAM Backend - Complete Data Flow & Quick Reference Guide**

---

## **Table of Contents**
1. [API Endpoints Quick Reference](#api-endpoints-quick-reference)
2. [Complete Data Flow Scenarios](#complete-data-flow-scenarios)
3. [Database CRUD Operations](#database-crud-operations)
4. [Request/Response Examples](#requestresponse-examples)

---

## **API Endpoints Quick Reference**

### **AUTHENTICATION ENDPOINTS**

| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| POST | `/api/login` | ❌ | User login (admin/student) | Login, Admin |
| POST | `/api/logout` | ✅ | User logout | - |

---

### **ADMIN ENDPOINTS**

#### **Profile Management**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/admin/profile` | ✅ Admin | Get admin profile | Admin |
| PATCH | `/api/admin/profile` | ✅ Admin | Update admin profile | Admin |

#### **Student Registration**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/admin/register` | ✅ Admin | Get all students | Login |
| POST | `/api/admin/register/new` | ✅ Admin | Register new student | Login, Logs |
| PATCH | `/api/admin/register/:s_id` | ✅ Admin | Edit student credentials | Login, Logs |
| DELETE | `/api/admin/register/:s_id` | ✅ Admin | Unregister student | Login, Student, Verify, Logs |

#### **Student Record Management**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/admin/record` | ✅ Admin | Get all student records | Student |
| GET | `/api/admin/record/:s_id` | ✅ Admin | Get specific student | Student |
| PATCH | `/api/admin/record/:s_id` | ✅ Admin | Edit student record | Student, Logs |

#### **Achievement Verification**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/admin/upload` | ✅ Admin | Get all submissions | Verify |
| PATCH | `/api/admin/upload/:v_id` | ✅ Admin | Verify achievement | Verify, Logs |
| GET | `/api/admin/upload/proof/:v_id` | ✅ Admin | Download proof file | Files |

#### **Notice Management**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/admin/notice` | ✅ Admin | Get all notices | Notice |
| POST | `/api/admin/notice` | ✅ Admin | Create notice | Notice, Logs |
| DELETE | `/api/admin/notice/:n_id` | ✅ Admin | Delete notice | Notice, Logs |

#### **Activity Logs**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/admin/logs` | ✅ Admin | Get system logs | Logs |

---

### **STUDENT ENDPOINTS**

#### **Profile Management**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/profile` | ✅ Student | Get profile | Student |
| PATCH | `/api/profile` | ✅ Student | Update profile | Student, Logs |

#### **Record Management**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| POST | `/api/record/setup` | ✅ Student | Setup profile (first-time) | Student, Logs |
| GET | `/api/record` | ✅ Student | Get record | Student |
| PATCH | `/api/record` | ✅ Student | Edit record | Student, Logs |

#### **Achievement Submission**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/upload` | ✅ Student | Get my submissions | Verify |
| POST | `/api/upload` | ✅ Student (file) | Submit achievement | Verify, Logs, Files |
| DELETE | `/api/upload/:v_id` | ✅ Student | Delete submission | Verify, Files, Logs |
| GET | `/api/upload/proof/:v_id` | ✅ Student | Download proof | Files |

#### **Notice View**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/notice` | ✅ Student | Get all notices | Notice |

#### **Activity Logs**
| Method | Endpoint | Auth | Purpose | Collections |
|--------|----------|------|---------|-------------|
| GET | `/api/logs` | ✅ Student | Get personal logs | Logs |

---

## **Complete Data Flow Scenarios**

### **SCENARIO 1: Complete Student Lifecycle**

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: ADMIN REGISTERS STUDENT                         │
└─────────────────────────────────────────────────────────┘
  ↓
  Admin clicks "Register New Student"
  ↓
  POST /api/admin/register/new
  Body: {
    s_id: "210001",
    name: "john doe",
    username: "john_doe",
    password: "pass123",
    role1: "1yr",
    role2: "cs",
    role3: "skilled"
  }
  ↓
  Backend Processing:
  1. Validate input with registerSchema
  2. Hash password with Argon2
  3. Create Login document
  4. Create Log entry (type: "register")
  ↓
  Collections Modified:
  • Login: INSERT
  • Logs: INSERT
  ↓
  Response: 201 Created


┌─────────────────────────────────────────────────────────┐
│ STEP 2: STUDENT LOGS IN (FIRST TIME)                    │
└─────────────────────────────────────────────────────────┘
  ↓
  Student enters: username: "john_doe", password: "pass123"
  ↓
  POST /api/login
  Body: {
    role: "student",
    username: "john_doe",
    password: "pass123"
  }
  ↓
  Backend Processing:
  1. Find student in Login collection
  2. Verify password with Argon2
  3. Check if Student record exists (setup = false)
  4. Create JWT token with payload
  5. Store token in httpOnly cookie
  ↓
  Response: 200 OK
  {
    success: true,
    user: {
      id: "210001",
      name: "john doe",
      role: ["student", "210001", "1yr", "cs", "skilled"],
      setup: false  ← Not setup yet
    }
  }
  ↓
  Frontend: Redirect to profile setup


┌─────────────────────────────────────────────────────────┐
│ STEP 3: STUDENT COMPLETES PROFILE SETUP (FIRST TIME)    │
└─────────────────────────────────────────────────────────┘
  ↓
  Student fills form with personal details
  ↓
  POST /api/record/setup
  Body: {
    dob: "2002-05-15",
    gender: "male",
    gmail: "john@gmail.com",
    contact: "9876543210",
    address: {
      locality: "downtown",
      city: "bangalore",
      district: "bangalore",
      state: "karnataka",
      pincode: "560001"
    }
  }
  ↓
  Backend Processing:
  1. Verify user is student (req.user.role[0] === "student")
  2. Check if already setup (req.user.setup === true)
  3. Validate input with setupSchema
  4. Calculate age from DOB
  5. Create Student document with calculated age
  6. Create Log entry (type: "setup")
  7. Update JWT token: setup = true
  ↓
  Collections Modified:
  • Student: INSERT
  • Logs: INSERT
  • Counter: INCREMENT (l_id)
  ↓
  Response: 201 Created
  {
    success: true,
    message: "Your record has been added"
  }
  ↓
  Frontend: Refresh token, proceed to dashboard


┌─────────────────────────────────────────────────────────┐
│ STEP 4: STUDENT SUBMITS ACHIEVEMENT                     │
└─────────────────────────────────────────────────────────┘
  ↓
  Student selects: Category → Skills
  ↓
  Student fills:
    - Skill Name: "Python"
    - Proficiency: "Advanced"
    - Message: "Python Programming"
    - Upload Certificate PDF
  ↓
  POST /api/upload (multipart/form-data)
  Form Data: {
    category: "skills",
    body: {"skill_name": "Python", "proficiency": "Advanced"},
    message: "Python Programming",
    proof: <file_object>
  }
  ↓
  Backend Processing:
  1. Verify user is student
  2. Validate multipart data
  3. Save file to /public/uploads/ → "210001_skills_1712658600.pdf"
  4. Create Verify document with auto-increment v_id
  5. Create Log entry (type: "request")
  6. Increment Counter (v_id)
  ↓
  Collections Modified:
  • Verify: INSERT
  • Logs: INSERT
  • Counter: INCREMENT (v_id)
  ↓
  File System:
  • /public/uploads/210001_skills_1712658600.pdf (created)
  ↓
  Response: 201 Created
  {
    success: true,
    message: "request submitted successfully",
    requestId: 1
  }


┌─────────────────────────────────────────────────────────┐
│ STEP 5: ADMIN REVIEWS & APPROVES ACHIEVEMENT           │
└─────────────────────────────────────────────────────────┘
  ↓
  Admin Panel → Pending Submissions
  ↓
  GET /api/admin/upload?status=pending
  Response contains all pending Verify documents
  ↓
  Admin views: v_id=1, category=skills, s_id=210001
  Admin clicks: "Approve"
  ↓
  Admin enters feedback: "Excellent Python skills!"
  ↓
  PATCH /api/admin/upload/1
  Body: {
    status: "accepted",
    feedback: "Excellent Python skills!"
  }
  ↓
  Backend Processing:
  1. Verify user is admin
  2. Find Verify document by v_id
  3. Update status and feedback
  4. Create Log entry (type: "update")
  5. Optionally notify student
  ↓
  Collections Modified:
  • Verify: UPDATE (status, feedback)
  • Logs: INSERT
  • Counter: INCREMENT (l_id)
  ↓
  Response: 201 OK
  {
    success: true,
    message: "verification request accepted"
  }


┌─────────────────────────────────────────────────────────┘
│ STEP 6: STUDENT VIEWS APPROVED ACHIEVEMENT             │
└─────────────────────────────────────────────────────────┘
  ↓
  Student Portal → My Submissions
  ↓
  GET /api/upload
  Response includes:
  {
    v_id: 1,
    category: "skills",
    status: "accepted",  ← Status changed!
    feedback: "Excellent Python skills!",
    proof: "/uploads/210001_skills_1712658600.pdf"
  }
  ↓
  Frontend: Display with green checkmark
```

---

### **SCENARIO 2: Admin Creates Notice & Student Receives**

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: ADMIN CREATES NOTICE                            │
└─────────────────────────────────────────────────────────┘
  ↓
  Admin Panel → Notices → New Notice
  ↓
  Form: {
    category: "job",
    subject: "Google Internship",
    body: "Google is hiring...",
    expire_date: "2025-05-15"
  }
  ↓
  POST /api/admin/notice
  ↓
  Backend Processing:
  1. Validate input
  2. Create Notice document
  3. Auto-increment n_id via Counter
  4. Create Log entry (type: "notice")
  ↓
  Collections Modified:
  • Notice: INSERT
  • Logs: INSERT
  • Counter: INCREMENT (n_id)
  ↓
  Response: 201 Created
  {
    success: true,
    message: "notice added successfully",
    noticeId: 1
  }


┌─────────────────────────────────────────────────────────┐
│ STEP 2: STUDENT RECEIVES NOTICE                         │
└─────────────────────────────────────────────────────────┘
  ↓
  Student Portal loads
  ↓
  GET /api/notice
  ↓
  Backend retrieves all Notice documents
  ↓
  Response includes:
  {
    n_id: 1,
    category: "job",
    subject: "Google Internship",
    body: "Google is hiring...",
    issue_date: "2025-04-09T16:00:00.000Z",
    expire_date: "2025-05-15T23:59:59.000Z"
  }
  ↓
  Frontend: Display notice banner
```

---

### **SCENARIO 3: Admin Views Activity Logs**

```
┌─────────────────────────────────────────────────────────┐
│ ADMIN VIEWS SYSTEM ACTIVITY LOGS                        │
└─────────────────────────────────────────────────────────┘
  ↓
  Admin Panel → Dashboard → Activity Logs
  ↓
  GET /api/admin/logs?startDate=2025-04-01&endDate=2025-04-30
  ↓
  Backend retrieves all Logs documents from date range
  ↓
  Response includes:
  [
    {
      l_id: 1,
      by: "teacher",
      s_id: "210001",
      type: "register",
      time: "2025-04-09T10:15:00.000Z",
      detail: {message: "Teacher register a student", data: {...}}
    },
    {
      l_id: 2,
      by: "student",
      s_id: "210001",
      type: "setup",
      time: "2025-04-09T11:30:00.000Z",
      detail: {message: "Student completed profile setup"}
    },
    {
      l_id: 3,
      by: "student",
      s_id: "210001",
      type: "request",
      time: "2025-04-09T14:45:00.000Z",
      detail: {message: "Student submitted achievement", v_id: 1}
    },
    ...
  ]
  ↓
  Frontend: Display detailed activity log with filters
```

---

## **Database CRUD Operations**

### **CREATE Operations (INSERT)**

#### **Create Login Record**
```javascript
// Location: POST /api/admin/register/new
db.login.insertOne({
  s_id: "210001",
  name: "john doe",
  username: "john_doe",
  password: "$argon2id$...",  // Hashed
  role: ["student", "210001", "1yr", "cs", "skilled"]
})
```

#### **Create Student Record**
```javascript
// Location: POST /api/record/setup
db.student.insertOne({
  s_id: "210001",
  name: {firstName: "john", middleName: "", lastName: "doe"},
  dob: "2002-05-15T00:00:00.000Z",
  age: 22,  // Auto-calculated
  gender: "male",
  gmail: "john@gmail.com",
  contact: "9876543210",
  address: {...},
  class: "1yr",
  branch: "cs",
  ...
})
```

#### **Create Verify Record**
```javascript
// Location: POST /api/upload
db.verify.insertOne({
  v_id: 1,  // Auto-incremented from Counter
  s_id: "210001",
  category: "skills",
  body: {skill_name: "Python", proficiency: "Advanced"},
  message: "Python Programming",
  proof: "/uploads/210001_skills_1712658600.pdf",
  status: "pending",
  creation_date: Date.now()
})
```

#### **Create Notice Record**
```javascript
// Location: POST /api/admin/notice
db.notice.insertOne({
  n_id: 1,  // Auto-incremented
  category: "job",
  for: ["student"],
  subject: "Google Internship",
  body: "Google is hiring...",
  issue_date: Date.now(),
  expire_date: "2025-05-15T23:59:59.000Z"
})
```

#### **Create Log Record**
```javascript
// Location: Any create/update/delete operation
db.logs.insertOne({
  l_id: 1,  // Auto-incremented
  by: "teacher",
  s_id: "210001",
  type: "register",
  time: Date.now(),
  detail: {message: "...", data: {...}}
})
```

---

### **READ Operations (SELECT)**

#### **Get Student by s_id**
```javascript
// Location: GET /api/record or GET /api/profile
db.student.findOne({ s_id: "210001" })
```

#### **Get All Pending Submissions**
```javascript
// Location: GET /api/admin/upload?status=pending
db.verify.find({ status: "pending" })
```

#### **Get Student's Submissions**
```javascript
// Location: GET /api/upload
db.verify.find({ s_id: "210001" })
```

#### **Get All Notices**
```javascript
// Location: GET /api/notice
db.notice.find({})
```

#### **Get Activity Logs**
```javascript
// Location: GET /api/admin/logs
db.logs.find({
  time: { $gte: startDate, $lte: endDate }
})
```

---

### **UPDATE Operations (MODIFY)**

#### **Update Student Profile**
```javascript
// Location: PATCH /api/profile
db.student.findOneAndUpdate(
  { s_id: "210001" },
  { $set: { fatherName: "new name", profile: "bio text" } },
  { new: true }
)
```

#### **Update Achievement Status**
```javascript
// Location: PATCH /api/admin/upload/:v_id
db.verify.findOneAndUpdate(
  { v_id: 1 },
  { $set: { status: "accepted", feedback: "Great work!" } },
  { new: true }
)
```

#### **Update Student Credentials**
```javascript
// Location: PATCH /api/admin/register/:s_id
db.login.findOneAndUpdate(
  { s_id: "210001" },
  { $set: { password: "$argon2id$...", role: [...] } },
  { new: true }
)
```

---

### **DELETE Operations (REMOVE)**

#### **Unregister Student**
```javascript
// Location: DELETE /api/admin/register/:s_id
// Multiple operations:
db.login.deleteOne({ s_id: "210001" })
db.student.deleteOne({ s_id: "210001" })
db.verify.deleteMany({ s_id: "210001" })
// + Log entry created
```

#### **Delete Submission**
```javascript
// Location: DELETE /api/upload/:v_id
db.verify.deleteOne({ v_id: 1 })
// Delete file from /public/uploads/
// + Log entry created
```

#### **Delete Notice**
```javascript
// Location: DELETE /api/admin/notice/:n_id
db.notice.deleteOne({ n_id: 1 })
```

---

## **Request/Response Examples**

### **Example 1: Login Request**

**Request:**
```http
POST /api/login HTTP/1.1
Content-Type: application/json

{
  "role": "student",
  "username": "john_doe",
  "password": "password123"
}
```

**Response (Success):**
```http
HTTP/1.1 200 OK
Set-Cookie: authToken=eyJhbGc...; HttpOnly; SameSite=Strict; Max-Age=1296000
Content-Type: application/json

{
  "success": true,
  "message": "login successful",
  "user": {
    "id": "210001",
    "name": "john doe",
    "role": ["student", "210001", "1yr", "cs", "skilled"],
    "setup": false
  }
}
```

---

### **Example 2: Submit Achievement Request**

**Request:**
```http
POST /api/upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
Cookie: authToken=eyJhbGc...

------WebKitFormBoundary
Content-Disposition: form-data; name="category"

skills
------WebKitFormBoundary
Content-Disposition: form-data; name="body"

{"skill_name":"Python","proficiency":"Advanced"}
------WebKitFormBoundary
Content-Disposition: form-data; name="message"

Python Programming Skill
------WebKitFormBoundary
Content-Disposition: form-data; name="proof"; filename="python_cert.pdf"
Content-Type: application/pdf

[binary file data]
------WebKitFormBoundary--
```

**Response (Success):**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "request submitted successfully",
  "requestId": 1
}
```

**Database State After Request:**
```
Collections Modified:
1. Verify - INSERT new document with v_id=1
2. Logs - INSERT log entry
3. Counter - INCREMENT v_id to 2
4. File System - Save file to /public/uploads/210001_skills_1712658600.pdf
```

---

### **Example 3: Admin Verifies Achievement**

**Request:**
```http
PATCH /api/admin/upload/1 HTTP/1.1
Content-Type: application/json
Cookie: authToken=eyJhbGc...

{
  "status": "accepted",
  "feedback": "Excellent Python programming skills! Certificate is valid."
}
```

**Response (Success):**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "verification request accepted"
}
```

**Database State After Request:**
```
Collections Modified:
1. Verify - UPDATE: status="accepted", feedback="..."
2. Logs - INSERT log entry (type="update")
3. Counter - INCREMENT l_id
```

---

### **Example 4: Get All Submissions (Admin)**

**Request:**
```http
GET /api/admin/upload?status=pending&category=skills HTTP/1.1
Cookie: authToken=eyJhbGc...
```

**Response (Success):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "count": 3,
  "data": [
    {
      "v_id": 1,
      "s_id": "210001",
      "category": "skills",
      "body": {"skill_name":"Python","proficiency":"Advanced"},
      "message": "Python Programming Skill",
      "proof": "/uploads/210001_skills_1712658600.pdf",
      "status": "pending",
      "feedback": null,
      "creation_date": "2025-04-09T14:45:00.000Z"
    },
    {
      "v_id": 2,
      "s_id": "210002",
      "category": "skills",
      "body": {"skill_name":"JavaScript","proficiency":"Intermediate"},
      "message": "JavaScript Programming",
      "proof": "/uploads/210002_skills_1712659000.pdf",
      "status": "pending",
      "feedback": null,
      "creation_date": "2025-04-09T15:00:00.000Z"
    },
    ...
  ]
}
```

---

### **Example 5: Get Personal Activity Logs (Student)**

**Request:**
```http
GET /api/logs HTTP/1.1
Cookie: authToken=eyJhbGc...
```

**Response (Success):**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "count": 5,
  "data": [
    {
      "l_id": 1,
      "by": "student",
      "s_id": "210001",
      "type": "setup",
      "time": "2025-04-09T11:30:00.000Z",
      "detail": {"message": "Student completed profile setup"}
    },
    {
      "l_id": 3,
      "by": "student",
      "s_id": "210001",
      "type": "request",
      "time": "2025-04-09T14:45:00.000Z",
      "detail": {"message": "Student submitted achievement", "v_id": 1}
    },
    {
      "l_id": 4,
      "by": "teacher",
      "s_id": "210001",
      "type": "update",
      "time": "2025-04-09T15:20:00.000Z",
      "detail": {"message": "Achievement approved", "v_id": 1}
    },
    ...
  ]
}
```

---

## **HTTP Status Codes Used**

| Code | Scenario | Example |
|------|----------|---------|
| **200** | GET success, logout success | `GET /api/record` returns 200 |
| **201** | POST/PATCH success | `POST /api/upload` returns 201 |
| **400** | Bad request, validation error | Missing required field |
| **401** | Unauthorized, invalid token | Missing auth token |
| **403** | Forbidden, already setup | `POST /api/record/setup` when already setup |
| **404** | Not found | User/document doesn't exist |
| **500** | Server error | Database connection error |

---

## **Key Implementation Details**

1. **File Upload:**
   - Multipart form data handled by multer middleware
   - Files stored in `/public/uploads/` directory
   - Referenced in database by path string

2. **Auto-Increment Pattern:**
   - v_id, n_id, l_id auto-incremented using Counter collection
   - Before save hook (pre-save middleware) retrieves next ID

3. **Password Security:**
   - Hashed with Argon2 (cost factor: 12)
   - Verified on login using argon2.verify()
   - Never stored in plain text

4. **JWT Authentication:**
   - 15-day expiry
   - Stored in httpOnly, strict SameSite cookies
   - Recreated on successful login

5. **Logging:**
   - Every significant action logged
   - Flexible 'detail' object for action-specific info
   - Searchable by date, type, user, student

---

**Document Version:** 1.0  
**Last Updated:** April 9, 2025  
**Complete Reference:** Covers all endpoints and data flows
