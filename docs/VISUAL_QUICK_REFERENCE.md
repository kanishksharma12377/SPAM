# **SPAM Backend - Visual Quick Reference Guide**

---

## **API Endpoint Structure Tree**

```
BASE: http://localhost:3000

AUTHENTICATION
├── POST /api/login ..................... User login (admin/student)
└── POST /api/logout .................... User logout

ADMIN PANEL (/api/admin)
├── PROFILE
│   ├── GET   /profile .................. Get admin profile
│   └── PATCH /profile .................. Update profile
│
├── STUDENT REGISTRATION
│   ├── GET    /register ................ Get all students
│   ├── POST   /register/new ............ Register new student
│   ├── PATCH  /register/:s_id .......... Edit credentials
│   └── DELETE /register/:s_id .......... Unregister student
│
├── STUDENT RECORDS
│   ├── GET    /record .................. Get all records
│   ├── GET    /record/:s_id ............ Get specific student
│   └── PATCH  /record/:s_id ............ Edit student record
│
├── ACHIEVEMENT VERIFICATION
│   ├── GET    /upload .................. Get all submissions
│   ├── PATCH  /upload/:v_id ............ Verify achievement
│   └── GET    /upload/proof/:v_id ...... Download proof
│
├── NOTICES
│   ├── GET    /notice .................. Get all notices
│   ├── POST   /notice .................. Create notice
│   └── DELETE /notice/:n_id ............ Delete notice
│
└── ACTIVITY LOGS
    └── GET    /logs .................... View system logs

STUDENT PANEL (/api)
├── PROFILE
│   ├── GET    /profile ................. Get profile
│   └── PATCH  /profile ................. Update profile
│
├── PROFILE SETUP (First Time)
│   ├── POST   /record/setup ............ Setup profile
│   ├── GET    /record .................. Get record
│   └── PATCH  /record .................. Edit record
│
├── ACHIEVEMENT SUBMISSION
│   ├── GET    /upload .................. Get my submissions
│   ├── POST   /upload .................. Submit achievement
│   ├── DELETE /upload/:v_id ............ Delete submission
│   └── GET    /upload/proof/:v_id ...... Download proof
│
├── NOTICES
│   └── GET    /notice .................. View notices
│
└── ACTIVITY LOGS
    └── GET    /logs .................... View personal logs
```

---

## **Database Collection Structure**

```
LOGIN COLLECTION
├── s_id (String, unique, index) ........ "210001"
├── name (String) ....................... "john doe"
├── username (String, unique) ........... "john_doe"
├── password (String, hashed) ........... "$argon2id$..."
└── role (Array[5]) ..................... ["student", "210001", "1yr", "cs", "skilled"]

ADMIN COLLECTION
├── a_id (String, unique, immutable) ... "admin_001"
├── name (String) ....................... "admin name"
├── contact (String, 10 digits) ........ "9876543210"
├── gmail (String, unique) .............. "admin@gmail.com"
├── image (String) ...................... "/defaultProfile.png"
├── username (String, unique) ........... "admin_username"
├── password (String, hashed) ........... "$argon2id$..."
└── role (String, fixed) ................ "admin"

STUDENT COLLECTION
├── s_id (String, unique) ............... "210001"
├── name (Object)
│   ├── firstName (String) .............. "john"
│   ├── middleName (String) ............ ""
│   └── lastName (String) .............. "doe"
├── fatherName (String) ................. "father name"
├── motherName (String) ................. "mother name"
├── dob (Date) .......................... "2002-05-15T00:00:00Z"
├── age (Number, auto-calc) ............ 22
├── gender (Enum) ....................... "male" | "female" | "other"
├── category (Enum) ..................... "gen" | "obc" | "st" | "sc"
├── image (String) ...................... "/defaultProfile.png"
├── gmail (String, unique) .............. "john@gmail.com"
├── contact (String, 10 digits) ........ "9876543210"
├── address (Object)
│   ├── locality (String) .............. "downtown"
│   ├── city (String) .................. "bangalore"
│   ├── district (String) .............. "bangalore"
│   ├── state (String) ................. "karnataka"
│   └── pincode (String, 6 digits) ..... "560001"
├── class (Enum) ........................ "1yr" | "2yr" | "3yr" | "4yr"
├── branch (Enum) ....................... "cs" | "ce" | "me" | "ee"
├── profile (String) .................... "bio text"
├── socialAccount (Array of Objects)
│   ├── name (String) .................. "linkedin"
│   └── link (String, URL) ............. "https://linkedin.com/..."
└── document (Array of Objects)
    ├── name (String) .................. "aadhar"
    ├── doc_no (String) ................ "123456789012"
    └── image (String, path) ........... "/uploads/filename.pdf"

VERIFY COLLECTION
├── v_id (Number, unique, auto-inc) ... 1
├── s_id (String) ....................... "210001"
├── category (Enum) ..................... "skills" | "result" | "certificate" | "project" | "internship"
├── body (Object, flexible) ............ {skill_name: "Python", ...}
├── message (String) .................... "Python Programming"
├── proof (String, file path) .......... "/uploads/210001_python_cert.pdf"
├── status (Enum) ....................... "pending" | "accepted" | "rejected"
├── feedback (String) ................... "Great work!"
└── creation_date (Date) ................ 2025-04-09T10:30:00Z

NOTICE COLLECTION
├── n_id (Number, unique, auto-inc) ... 1
├── category (Enum) ..................... "general" | "exam" | "project" | "internship" | "job" | "event" | "update"
├── for (Array) ......................... ["student"]
├── subject (String) .................... "Google Internship"
├── body (String) ....................... "We are hiring..."
├── issue_date (Date) ................... 2025-04-09T00:00:00Z
└── expire_date (Date) .................. 2025-05-15T23:59:59Z

LOGS COLLECTION
├── l_id (Number, unique, auto-inc) ... 1
├── by (Enum) ........................... "teacher" | "student"
├── s_id (String) ....................... "210001"
├── type (Enum) ......................... "register" | "unregister" | "request" | "update" | "notice" | "setup"
├── time (Date) ......................... 2025-04-09T10:30:00Z
└── detail (Object, flexible) .......... {message: "...", data: {...}}

COUNTER COLLECTION
├── name (String, unique) ............... "autoInc"
├── v_id (Number) ....................... 150
├── n_id (Number) ....................... 25
└── l_id (Number) ....................... 500
```

---

## **Request/Response Status Codes**

```
✅ SUCCESS RESPONSES
├── 200 OK ............................ GET requests, logout
├── 201 Created ....................... POST, PATCH (create/update)
└── 204 No Content .................... DELETE

⚠️ CLIENT ERROR RESPONSES
├── 400 Bad Request ................... Validation error, bad input
├── 401 Unauthorized .................. Missing/invalid auth token
├── 403 Forbidden ..................... Already setup, not allowed
└── 404 Not Found ..................... Document/user not found

❌ SERVER ERROR RESPONSES
└── 500 Internal Server Error ......... Database/server error
```

---

## **Authentication Flow**

```
STEP 1: CLIENT SENDS LOGIN REQUEST
┌─────────────────────────────────┐
│ POST /api/login                 │
│ Body: {                         │
│   role: "student",              │
│   username: "john_doe",         │
│   password: "password123"       │
│ }                               │
└─────────────────────────────────┘
            ↓
STEP 2: SERVER VALIDATES
├─ Find user in Login/Admin collection
├─ Verify password with Argon2
├─ Check profile setup status
└─ Create JWT token
            ↓
STEP 3: SEND RESPONSE WITH COOKIE
┌─────────────────────────────────┐
│ HTTP 200 OK                     │
│ Set-Cookie: authToken=...;      │
│            HttpOnly;            │
│            SameSite=strict;     │
│            Max-Age=1296000      │
│ Body: {                         │
│   success: true,                │
│   user: {                       │
│     id: "210001",               │
│     name: "john doe",           │
│     role: [...],                │
│     setup: false                │
│   }                             │
│ }                               │
└─────────────────────────────────┘
            ↓
STEP 4: FUTURE REQUESTS
┌─────────────────────────────────┐
│ GET /api/record                 │
│ Cookie: authToken=...           │
│                                 │
│ Backend: Verify JWT →           │
│ Attach user to req.user →       │
│ Execute endpoint logic          │
└─────────────────────────────────┘
            ↓
STEP 5: LOGOUT
┌─────────────────────────────────┐
│ POST /api/logout                │
│ Cookie: authToken=...           │
│                                 │
│ Server clears cookie            │
│ Response: HTTP 200              │
└─────────────────────────────────┘
```

---

## **Data Validation Rules**

```
COMMON VALIDATIONS
├── Email: RFC 5322 standard
│   └─ Example: "user@gmail.com"
│
├── Phone: 10 digits only
│   └─ Example: "9876543210"
│
├── Pincode: 6 digits only
│   └─ Example: "560001"
│
├── Enums
│   ├─ Gender: ["male", "female", "other"]
│   ├─ Class: ["1yr", "2yr", "3yr", "4yr"]
│   └─ Branch: ["cs", "ce", "me", "ee"]
│
├── Role Array: [role, s_id, class, branch, skill_status]
│   └─ Example: ["student", "210001", "1yr", "cs", "skilled"]
│
├── Text Case
│   ├─ Lowercase applied to: name, username, email, address
│   └─ Exception: Title fields keep original case
│
└── Whitespace
    └─ Trimmed from all string inputs
```

---

## **File Upload Specifications**

```
ENDPOINT: POST /api/upload
TYPE: multipart/form-data

FORM FIELDS:
├── category (String) ................ Required
│   └─ Values: "skills", "result", "certificate", "project", "internship"
│
├── body (String, JSON) .............. Required
│   └─ Example: '{"skill_name":"Python","proficiency":"Advanced"}'
│
├── message (String) .................. Required
│   └─ Example: "Python Programming Certificate"
│
└── proof (File) ...................... Required
    └─ Formats: PDF, JPG, PNG, GIF, WEBP

STORAGE:
├── Directory: /public/uploads/
├── Naming: Auto-generated with timestamp
└── Access: Via GET /api/upload/proof/:v_id

SECURITY:
├── Validation: File type check
├── Size Limit: Configurable
└── Access: Authenticated users only
```

---

## **Achievement Categories & body Field Structure**

```
SKILLS
├── body Fields:
│   ├── skill_name (String) ........... "Python"
│   ├── proficiency (String) .......... "Advanced"
│   └── years_of_experience (String) . "3"
└── Example: /uploads/210001_python_cert.pdf

CERTIFICATE
├── body Fields:
│   ├── certificate_name (String) .... "AWS Certified Cloud Practitioner"
│   ├── issuing_organization ......... "Amazon Web Services"
│   ├── issue_date (Date) ............ "2025-03-15"
│   └── credential_id (String) ....... "AWS-12345-67890"
└── Example: /uploads/210001_aws_cert.pdf

PROJECT
├── body Fields:
│   ├── project_name (String) ........ "E-commerce Platform"
│   ├── description (String) ......... "Full-stack MERN application"
│   ├── start_date (Date) ............ "2025-01-01"
│   ├── end_date (Date) .............. "2025-03-31"
│   └── github_link (String, URL) .... "https://github.com/..."
└── Example: /uploads/210001_project_report.pdf

INTERNSHIP
├── body Fields:
│   ├── company_name (String) ........ "Microsoft"
│   ├── position (String) ............ "Software Developer Intern"
│   ├── duration (String) ............ "3 months"
│   ├── start_date (Date) ............ "2025-05-15"
│   ├── end_date (Date) .............. "2025-08-15"
│   └── responsibilities (Array) ..... ["Backend development", "API design"]
└── Example: /uploads/210001_internship_letter.pdf

RESULT
├── body Fields:
│   ├── semester (String) ............ "3"
│   ├── cgpa (Number) ................ "8.5"
│   ├── subjects (Array) ............ [{name: "DBMS", marks: "95"}]
│   └── remarks (String) ............ "Distinction"
└── Example: /uploads/210001_result_transcript.pdf
```

---

## **HTTP Method Usage**

```
GET    - Retrieve data
         └── No data modification
         └── Safe and idempotent

POST   - Create new resource
         ├── Returns 201 Created
         └── Creates new documents

PATCH  - Update existing resource
         ├── Returns 201 (for responses)
         ├── Updates specific fields only
         └── Partial update

DELETE - Remove resource
         ├── Returns 200 OK
         └── Removes document entirely
```

---

## **Common Query Parameters**

```
FILTER BY STATUS:
?status=pending       (pending | accepted | rejected)

FILTER BY CATEGORY:
?category=skills      (skills | result | certificate | project | internship)

FILTER BY STUDENT:
?s_id=210001

FILTER BY DATE RANGE:
?startDate=2025-04-01
?endDate=2025-04-30

FILTER BY LOG TYPE:
?type=register        (register | unregister | request | update | notice | setup)

FILTER BY LOG SOURCE:
?by=teacher           (teacher | student)

EXAMPLES:
GET /api/admin/upload?status=pending&category=skills
GET /api/admin/logs?startDate=2025-04-01&endDate=2025-04-30&by=teacher
GET /api/admin/upload?s_id=210001
```

---

## **Error Response Examples**

```
BAD REQUEST (400)
{
  "success": false,
  "message": "Invalid input",
  "error": "age must be a number"
}

UNAUTHORIZED (401)
{
  "success": false,
  "message": "Unauthorized"
}

FORBIDDEN (403)
{
  "success": false,
  "message": "Account already setup"
}

NOT FOUND (404)
{
  "success": false,
  "message": "Can't find data"
}

SERVER ERROR (500)
{
  "success": false,
  "message": "Server error",
  "error": "MongoDB connection failed"
}
```

---

## **Password Security**

```
HASHING ALGORITHM: Argon2
├── Version: ID variant
├── Memory Cost: 65536 KB
├── Time Cost: 3 iterations
├── Parallelism: 4 threads
└── Current Hash Example:
    $argon2id$v=19$m=65536,t=3,p=4$...

VERIFICATION PROCESS:
1. User provides password
2. System calls argon2.verify(hash, password)
3. Returns: true/false
4. No password ever stored in plain text

APPLICATION POINTS:
├── Student registration: Password hashed before storing
├── Admin registration: Password hashed before storing
├── Login: Password verified from hash
└── Credential update: New password re-hashed
```

---

## **JWT Token Details**

```
TOKEN STRUCTURE:
HEADER.PAYLOAD.SIGNATURE

PAYLOAD CONTENTS:
{
  id: "210001",                    // User ID
  name: "john doe",                // User name
  role: ["student", ...],          // Role info
  setup: true,                     // Profile setup status
  iat: 1712658600,                 // Issued at
  exp: 1714450800                  // Expires at (15 days)
}

STORAGE:
├── Cookie Name: authToken
├── HttpOnly: true (prevent JavaScript access)
├── SameSite: strict (CSRF protection)
├── MaxAge: 15 days (1,296,000 seconds)
└── Secure: true (HTTPS only, recommended for production)

VERIFICATION:
1. Extract token from cookie
2. Verify signature with JWT_SECRET
3. Check expiry timestamp
4. Attach decoded payload to req.user
5. Continue to endpoint or reject (401)
```

---

## **Quick Debugging Checklist**

```
ENDPOINT NOT WORKING?
├─ [ ] Check authentication: Cookie present?
├─ [ ] Verify role: Admin/Student?
├─ [ ] Validate input: Matches schema?
├─ [ ] Check path params: Correct IDs?
├─ [ ] Review logs: Error message?
└─ [ ] Database: Collection exists?

LOGIN FAILS?
├─ [ ] Username exists in collection?
├─ [ ] Password correct (Argon2 verify)?
├─ [ ] Role valid (admin/student)?
└─ [ ] No account lock?

FILE UPLOAD FAILS?
├─ [ ] Multipart form-data used?
├─ [ ] File format supported?
├─ [ ] /public/uploads/ directory writable?
├─ [ ] File size within limit?
└─ [ ] Required fields: category, body, message, proof?

DATABASE QUERY WRONG?
├─ [ ] Correct collection name?
├─ [ ] Correct field names (case-sensitive)?
├─ [ ] Index used for s_id queries?
├─ [ ] Auto-increment counter working?
└─ [ ] Validation rules applied?
```

---

## **Quick Reference Table: HTTP Methods by Feature**

| Feature | GET | POST | PATCH | DELETE |
|---------|-----|------|-------|--------|
| **Read Endpoint** | ✅ | ❌ | ❌ | ❌ |
| **Create Endpoint** | ❌ | ✅ | ❌ | ❌ |
| **Update Endpoint** | ❌ | ❌ | ✅ | ❌ |
| **Delete Endpoint** | ❌ | ❌ | ❌ | ✅ |
| **List All** | ✅ | ❌ | ❌ | ❌ |
| **Get by ID** | ✅ | ❌ | ❌ | ❌ |
| **Modify Fields** | ❌ | ❌ | ✅ | ❌ |
| **Remove Record** | ❌ | ❌ | ❌ | ✅ |

---

**Use this as a desk reference while developing!**  
**Last Updated:** April 9, 2025  
**Version:** 1.0
