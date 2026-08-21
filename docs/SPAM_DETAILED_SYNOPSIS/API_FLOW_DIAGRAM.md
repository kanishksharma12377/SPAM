# 🔗 SPAM System - Complete API Connection Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SPAM SYSTEM ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐         ┌──────────────────────────────────────────┐
│  FRONTEND (Port 5173)   │         │    BACKEND (Port 3000)                   │
│  React + Vite           │◄───────►│    Express + MongoDB                      │
└─────────────────────────┘         └──────────────────────────────────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌─────────────────────────┐         ┌──────────────────────────────────────────┐
│  backend-api.js         │         │    Routes & Controllers                   │
│  • apiFetch()           │         │    • Middleware: authCheck, setupCheck    │
│  • authAPI              │         │    • Validation: Zod schemas             │
│  • studentAPI           │         │    • Utils: logs, calculateAge           │
│  • adminAPI             │         └──────────────────────────────────────────┘
└─────────────────────────┘                     │
                                                │
                                                ▼
                                    ┌──────────────────────────────────────────┐
                                    │  MongoDB Database: spam                   │
                                    │  URI: mongodb://localhost:27017/spam     │
                                    └──────────────────────────────────────────┘
                                                │
                                                │
                    ┌───────────────────────────┴──────────────────────────────┐
                    │                                                            │
                    ▼                                                            ▼
    ┌───────────────────────────┐                           ┌──────────────────────────────┐
    │  Admin Collections        │                           │  Student Collections          │
    │  • admins (Admin Model)   │                           │  • logins (Login Model)       │
    │  • logs (Logs Model)      │                           │  • students (Student Model)   │
    │  • notices (Notice Model) │                           │  • verify (Verify Model)      │
    └───────────────────────────┘                           └──────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                          AUTHENTICATION FLOW
═══════════════════════════════════════════════════════════════════════════════

LoginPage.jsx ──┐
                │  authAPI.login(username, password, role)
                └──► POST /api/login ──► loginUserController.js
                                              │
                                              ├─► Verify from logins or admins collection
                                              ├─► Generate JWT token
                                              └─► Set cookie → Return user data

Dashboard ──────┐
                │  authAPI.logout()
                └──► POST /api/logout ──► logoutUserController.js
                        │  [authCheck middleware]
                        └─► Clear cookie → Return success


═══════════════════════════════════════════════════════════════════════════════
                        ADMIN DASHBOARD FLOW
═══════════════════════════════════════════════════════════════════════════════

admin/Dashboard.jsx
    │
    ├─► adminAPI.getProfile() ──────────────────► GET /api/admin/profile
    │                                                  └─► Returns admin data
    │
    ├─► adminAPI.getRegisteredStudents() ───────► GET /api/admin/register
    │                                                  └─► Returns students list
    │
    ├─► adminAPI.getUploadRequests() ───────────► GET /api/admin/upload
    │                                                  └─► Returns verification requests
    │
    └─► adminAPI.getNotices() ──────────────────► GET /api/admin/notice
                                                       └─► Returns all notices


═══════════════════════════════════════════════════════════════════════════════
                        STUDENT DASHBOARD FLOW
═══════════════════════════════════════════════════════════════════════════════

student/Dashboard.jsx
    │
    ├─► studentAPI.getProfile() ────────────────► GET /api/profile
    │                                                  └─► Returns student profile
    │
    ├─► studentAPI.getRecord() ─────────────────► GET /api/record
    │                                                  └─► Returns achievements data
    │
    └─► studentAPI.getUploads() ────────────────► GET /api/upload
                                                       └─► Returns user's requests


═══════════════════════════════════════════════════════════════════════════════
                   ADMIN: STUDENT MANAGEMENT (Students.jsx)
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  GET Students List                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.getRegisteredStudents() ──► GET /api/admin/register
                                          │
                                          └─► registerController.getRegisteredStudents()
                                                  └─► Login.find().select('-password')

┌─────────────────────────────────────────────────────────────────────────────┐
│  Register New Student                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.registerStudent({
    s_id, name, username, password, role1, role2, role3
}) ──────────────────────────────► POST /api/admin/register/new
                                        │
                                        ├─► Hash password with argon2
                                        ├─► Create Login document
                                        └─► Log: "register" action

┌─────────────────────────────────────────────────────────────────────────────┐
│  Update Student Credentials                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.updateStudentCredentials(s_id, {
    username, password, role
}) ──────────────────────────────► PATCH /api/admin/register/:s_id
                                        │
                                        ├─► Hash new password
                                        ├─► Update Login document
                                        └─► Log: "update" action

┌─────────────────────────────────────────────────────────────────────────────┐
│  Delete Student                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.deleteStudent(s_id) ──────► DELETE /api/admin/register/:s_id
                                          │
                                          ├─► Delete from Login
                                          ├─► Delete from Student
                                          ├─► Delete all Verify requests
                                          └─► Log: "unregister" action


═══════════════════════════════════════════════════════════════════════════════
                   ADMIN: RECORDS MANAGEMENT (Records.jsx)
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  Get All Records                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.getRecordsList() ──────────► GET /api/admin/record
                                          │
                                          └─► Student.find().select(key fields)
                                               • Only students with profile setup

┌─────────────────────────────────────────────────────────────────────────────┐
│  Get Specific Student Record                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.getStudentRecord(s_id) ────► GET /api/admin/record/:s_id
                                          │
                                          └─► Student.findOne({ s_id })
                                               • Full record with all achievements

┌─────────────────────────────────────────────────────────────────────────────┐
│  Update Student Record                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.updateStudentRecord(s_id, recordData) ──► PATCH /api/admin/record/:s_id
                                                        │
                                                        └─► Update Student document


═══════════════════════════════════════════════════════════════════════════════
                   ADMIN: UPLOAD VERIFICATION (Uploads.jsx)
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  Get All Upload Requests                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.getUploadRequests() ───────► GET /api/admin/upload
                                          │
                                          └─► Verify.find().sort({ creation_date: -1 })

┌─────────────────────────────────────────────────────────────────────────────┐
│  Approve/Reject Request                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.verifyRequest(v_id, {
    status: "approved" | "rejected",
    reason: "feedback text"
}) ──────────────────────────────► PATCH /api/admin/upload/:v_id
                                        │
                                        ├─► Update Verify document status
                                        ├─► If approved: Add to Student record
                                        │   (skills/result/certificate/project/internship)
                                        └─► Log: "request" action

┌─────────────────────────────────────────────────────────────────────────────┐
│  Delete Request (API exists, UI missing)                                      │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.deleteRequest(v_id) ───────► DELETE /api/admin/upload/:v_id
                                          │
                                          └─► Delete Verify document


═══════════════════════════════════════════════════════════════════════════════
                   ADMIN: NOTICES MANAGEMENT (Notices.jsx)
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  Get All Notices                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.getNotices() ──────────────► GET /api/admin/notice
                                          │
                                          └─► Notice.find().sort({ issue_date: -1 })

┌─────────────────────────────────────────────────────────────────────────────┐
│  Create Notice                                                                │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.createNotice({
    category, for, subject, body, expire_date
}) ──────────────────────────────► POST /api/admin/notice
                                        │
                                        ├─► Create Notice document (auto n_id)
                                        └─► Log: "notice" action

┌─────────────────────────────────────────────────────────────────────────────┐
│  Delete Notice                                                                │
└─────────────────────────────────────────────────────────────────────────────┘
adminAPI.deleteNotice(n_id) ────────► DELETE /api/admin/notice/:n_id
                                          │
                                          └─► Delete Notice document


═══════════════════════════════════════════════════════════════════════════════
                   STUDENT: SETUP FLOW (Setup.jsx)
═══════════════════════════════════════════════════════════════════════════════

student/Setup.jsx
    │  [First-time login, setup: false]
    │
    └─► studentAPI.setupRecord({
            firstName, lastName, dob, gender, category,
            gmail, contact, address, profile, ...
        }) ──────────────────────────────► POST /api/record/setup
                                                │
                                                ├─► Create Student document
                                                ├─► Update Login.setup = true
                                                └─► Log: "setup" action


═══════════════════════════════════════════════════════════════════════════════
                   STUDENT: PORTFOLIO (Portfolio.jsx) - ⚠️ NOT CONNECTED
═══════════════════════════════════════════════════════════════════════════════

❌ Currently Static - Needs Implementation:

student/Portfolio.jsx (SHOULD DO):
    │
    ├─► studentAPI.getProfile() ────────────► GET /api/profile
    │       └─► Returns: name, s_id, class, branch, gmail, contact, etc.
    │
    ├─► studentAPI.getRecord() ─────────────► GET /api/record
    │       └─► Returns: skills[], result[], certificate[], 
    │                    project[], internship[]
    │
    ├─► studentAPI.updateProfile(data) ─────► PATCH /api/profile
    │       └─► Update: contact, gmail, address, social accounts
    │
    └─► studentAPI.updateRecord(data) ──────► PATCH /api/record
            └─► Update: skills, projects (non-verified items)


═══════════════════════════════════════════════════════════════════════════════
                   STUDENT: UPLOADS (Upload.jsx) - ⚠️ NOT CONNECTED
═══════════════════════════════════════════════════════════════════════════════

❌ Currently Shows Toast Only - Needs Implementation:

student/Upload.jsx (SHOULD DO):
    │
    ├─► studentAPI.getUploads() ────────────► GET /api/upload
    │       └─► Returns: User's verification requests
    │           { v_id, category, body, status, feedback, creation_date }
    │
    ├─► studentAPI.createUpload({
    │       category: "skills|result|certificate|project|internship",
    │       body: { ...achievement data },
    │       message: "Description"
    │   }) ──────────────────────────────────► POST /api/upload
    │       │
    │       ├─► Create Verify document (auto v_id)
    │       └─► Status: "pending"
    │
    └─► studentAPI.deleteUpload(v_id) ──────► DELETE /api/upload/:v_id
            └─► Delete pending request (before admin reviews)


═══════════════════════════════════════════════════════════════════════════════
                   STUDENT: VIEW NOTICES & LOGS
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  Get Notices (used in Dashboard)                                              │
└─────────────────────────────────────────────────────────────────────────────┘
studentAPI.getNotices() ────────────► GET /api/notice
                                          │
                                          └─► Notice.find({ for: "student" })

┌─────────────────────────────────────────────────────────────────────────────┐
│  Get Logs (API exists, NO PAGE) ⚠️                                            │
└─────────────────────────────────────────────────────────────────────────────┘
studentAPI.getLogs() ───────────────► GET /api/logs
                                          │
                                          └─► Logs.find({ s_id: user.id })
                                               • User's activity history


═══════════════════════════════════════════════════════════════════════════════
                          DATABASE MODELS SCHEMA
═══════════════════════════════════════════════════════════════════════════════

┌───────────────────────┐
│  Login Model          │  → Authentication data for students
├───────────────────────┤
│  s_id (unique)        │
│  name                 │
│  username (unique)    │
│  password (hashed)    │
│  role: [String]       │  ["student", s_id, "1yr", "cs", "none"]
└───────────────────────┘

┌───────────────────────┐
│  Student Model        │  → Full student profile & achievements
├───────────────────────┤
│  s_id (unique)        │
│  name: {              │  firstName, middleName, lastName
│    firstName,         │
│    lastName           │
│  }                    │
│  fatherName, motherN  │
│  dob, age, gender     │
│  category             │  gen/obc/st/sc
│  image, gmail, contact│
│  address: {}          │  locality, city, district, state, pincode
│  class, branch        │  1yr-4yr, cs/ce/me/ee
│  profile              │  Bio/description
│  socialAccount: []    │  [{ name, link }]
│  document: []         │  [{ name, doc_no, image }]
│  ────────────────────│
│  ✓ skills: []         │  [{ v_id, name, topic[] }]
│  ✓ result: []         │  [{ v_id, name, r_no, score, image }]
│  ✓ certificate: []    │  [{ v_id, name, c_id, image }]
│  ✓ project: []        │  [{ v_id, name, desc, tech[], image, link }]
│  ✓ internship: []     │  [{ v_id, company, field, duration, cert_image }]
└───────────────────────┘
     ▲
     │ (Added after admin approval)
     │
┌───────────────────────┐
│  Verify Model         │  → Verification requests
├───────────────────────┤
│  v_id (auto-inc)      │
│  s_id                 │
│  category             │  skills/result/certificate/project/internship
│  body: {}             │  Achievement data
│  message              │  Student's note
│  status               │  pending/accepted/rejected
│  feedback             │  Admin's response
│  creation_date        │
└───────────────────────┘

┌───────────────────────┐
│  Notice Model         │  → System announcements
├───────────────────────┤
│  n_id (auto-inc)      │
│  category             │  general/exam/project/internship/job/event
│  for: []              │  ["student"] - target audience
│  subject              │
│  body                 │
│  issue_date           │
│  expire_date          │
└───────────────────────┘

┌───────────────────────┐
│  Logs Model           │  → System activity logs
├───────────────────────┤
│  l_id (auto-inc)      │
│  by                   │  teacher/student
│  s_id                 │  (if student action)
│  type                 │  register/unregister/request/update/notice/setup
│  time                 │
│  detail: {}           │  Additional info
└───────────────────────┘

┌───────────────────────┐
│  Admin Model          │  → Admin user data
├───────────────────────┤
│  a_id (unique)        │
│  name                 │
│  contact, gmail       │
│  image                │
│  username (unique)    │
│  password (hashed)    │
│  role: "admin"        │
└───────────────────────┘

┌───────────────────────┐
│  Counter Model        │  → Auto-increment counters
├───────────────────────┤
│  name: "autoInc"      │
│  v_id                 │  Current verify ID
│  n_id                 │  Current notice ID
│  l_id                 │  Current log ID
└───────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                          MIDDLEWARE & SECURITY
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│  authCheck Middleware                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Verify JWT token from cookie                                               │
│  • Decode user data (id, role, setup)                                        │
│  • Attach req.user                                                            │
│  • Used by ALL protected routes                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  setupCheck Middleware                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Check if student completed profile setup                                   │
│  • Block access if setup: false                                              │
│  • Used by student routes (except /record/setup)                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  Password Hashing                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Library: argon2                                                            │
│  • Hash on registration                                                       │
│  • Verify on login                                                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  Validation (Zod)                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  • loginSchema                                                                │
│  • Admin: createNoticeSchema, editProfileSchema, registerStudentSchema, ...  │
│  • Student: setupSchema, editProfileSchema, uploadSchema, ...                │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                       COMPLETE ENDPOINT SUMMARY
═══════════════════════════════════════════════════════════════════════════════

AUTH (2)
├─ POST   /api/login         ✅ Connected
└─ POST   /api/logout        ✅ Connected

ADMIN (16)
├─ Profile (2)
│  ├─ GET    /api/admin/profile         ✅ Connected
│  └─ PATCH  /api/admin/profile         ⚠️  API ready, UI missing
├─ Students (4)
│  ├─ GET    /api/admin/register        ✅ Connected
│  ├─ POST   /api/admin/register/new    ✅ Connected
│  ├─ PATCH  /api/admin/register/:s_id  ✅ Connected
│  └─ DELETE /api/admin/register/:s_id  ✅ Connected
├─ Records (3)
│  ├─ GET    /api/admin/record          ✅ Connected
│  ├─ GET    /api/admin/record/:s_id    ✅ Connected
│  └─ PATCH  /api/admin/record/:s_id    ✅ Connected
├─ Uploads (3)
│  ├─ GET    /api/admin/upload          ✅ Connected
│  ├─ PATCH  /api/admin/upload/:v_id    ✅ Connected
│  └─ DELETE /api/admin/upload/:v_id    ⚠️  API ready, UI missing
├─ Notices (3)
│  ├─ GET    /api/admin/notice          ✅ Connected
│  ├─ POST   /api/admin/notice          ✅ Connected
│  └─ DELETE /api/admin/notice/:n_id    ✅ Connected
└─ Logs (1)
   └─ GET    /api/admin/logs             ⚠️  API ready, page missing

STUDENT (9)
├─ Profile (2)
│  ├─ GET    /api/profile               ✅ Connected
│  └─ PATCH  /api/profile               ⚠️  API ready, UI missing
├─ Record (3)
│  ├─ POST   /api/record/setup          ✅ Connected
│  ├─ GET    /api/record                ✅ Connected
│  └─ PATCH  /api/record                ⚠️  API ready, UI missing
├─ Upload (3)
│  ├─ GET    /api/upload                ❌ Not connected in UI
│  ├─ POST   /api/upload                ❌ Not connected in UI
│  └─ DELETE /api/upload/:v_id          ❌ Not connected in UI
├─ Notice (1)
│  └─ GET    /api/notice                ✅ Connected
└─ Logs (1)
   └─ GET    /api/logs                   ⚠️  API ready, page missing

TOTAL: 25 endpoints
✅ Fully Working: 18 (72%)
⚠️  API Ready, UI Missing: 5 (20%)
❌ Not Connected: 3 (12%) - All in Upload.jsx


═══════════════════════════════════════════════════════════════════════════════
                          CORS & ENVIRONMENT
═══════════════════════════════════════════════════════════════════════════════

Backend (.env):
    MONGODB_URI=mongodb://localhost:27017/spam
    PORT=3000
    JWT_SECRET=devcpp

Frontend (.env):
    VITE_API_BASE_URL=http://localhost:3000

CORS Config:
    origin: 'http://localhost:5173'
    credentials: true  (allows cookies for JWT)

Cookie Settings:
    httpOnly: true
    secure: false (for localhost)
    sameSite: 'lax'


═══════════════════════════════════════════════════════════════════════════════
                            END OF MAP
═══════════════════════════════════════════════════════════════════════════════

Legend:
✅ = Fully connected and working
⚠️  = Backend ready, frontend API exists, UI incomplete
❌ = Not connected in frontend

```
