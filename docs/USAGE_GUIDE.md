# SPAM System - Complete Usage Guide

## 🚀 Quick Start

### Backend Server
The backend is running at: **http://localhost:3000**

### Frontend Application
The frontend is running at: **http://localhost:5173**

---

## 👤 Default Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `Admin@123`
- **Role**: Select "Admin" from dropdown

### Student Accounts
⚠️ **There are NO default student accounts!**

Students must be **registered by the admin first**. Follow the steps below.

---

## 📋 Step-by-Step Workflow

### Step 1: Login as Admin
1. Go to http://localhost:5173/login
2. Select "Admin" from the dropdown
3. Enter username: `admin`
4. Enter password: `Admin@123`
5. Click "Login as admin"

### Step 2: Register Students (Admin)
1. After login, navigate to **Students** page
2. Click "Register New Student" button
3. Fill in the form:
   - Full Name (e.g., "John Doe")
   - Username (e.g., "john123")
   - Email (e.g., "john@example.com")
   - Password (e.g., "Student@123")
4. Click "Register Student"
5. Repeat for multiple students if needed

### Step 3: Logout and Login as Student
1. Click "Logout" in navigation
2. Go back to login page
3. Select "Student" from dropdown
4. Enter the student credentials you just created
5. Click "Login as student"

### Step 4: Complete Student Profile Setup
On first login, students MUST complete their profile:
1. You'll be automatically redirected to **Setup** page
2. Fill in all required fields:
   - Date of Birth
   - Contact Number (10 digits)
   - Gmail Address
   - Full Address (with locality, city, district, state, pincode)
   - About (brief bio)
   - Father's Name, Mother's Name
   - Gender, Category
3. Click "Complete Setup"
4. You'll be redirected to Student Dashboard

### Step 5: Student Actions

#### Upload Activity for Verification
1. Navigate to **Upload** page
2. Click "Submit New Activity"
3. Fill in:
   - Title (e.g., "Web Development Workshop")
   - Description
   - Category (Workshop/Hackathon/Certification/etc.)
   - Points (expected points)
   - Date
   - Document Link (Google Drive/GitHub/etc.)
4. Click "Submit Request"

#### View Portfolio
1. Navigate to **Portfolio** page
2. See all your approved activities
3. View total points earned

#### Check Points
1. Navigate to **Points** page
2. See breakdown of points by category
3. View ranking and achievements

### Step 6: Admin Review (Login as Admin Again)

#### Review Upload Requests
1. Navigate to **Uploads** page
2. See all pending student submissions
3. For each request:
   - Click **Approve** (with optional comment)
   - Or click **Reject** (must provide reason)
4. Filter by: All / Pending / Approved / Rejected

#### Post Announcements
1. Navigate to **Notices** page
2. Click "Create Notice"
3. Fill in:
   - Title (e.g., "Important: Exam Schedule")
   - Description
   - Link (optional)
4. Click "Create Notice"
5. All students can now see this announcement

#### View Student Records
1. Navigate to **Records** page
2. See all students who completed profile setup
3. View detailed information:
   - Personal details
   - Contact information
   - Academic info
4. Search students by name or ID

---

## 🎯 Available Features

### Admin Panel
✅ **Dashboard** - Overview with stats and quick actions
✅ **Students** - Register, view, search, delete students
✅ **Records** - View detailed student profiles and portfolios
✅ **Uploads** - Review and approve/reject student submissions
✅ **Notices** - Create and manage announcements
✅ **Logs** - View system activity logs (backend endpoint exists)

### Student Panel
✅ **Dashboard** - Overview of profile and activities
✅ **Setup** - Complete profile on first login
✅ **Upload** - Submit activities for admin verification
✅ **Portfolio** - View all approved activities
✅ **Points** - See points breakdown and rankings
✅ **Notices** - Read announcements from admin

---

## 🔧 Backend API Endpoints

### Authentication
- POST `/api/login` - Login (admin/student)
- POST `/api/logout` - Logout

### Admin Endpoints
- GET `/api/admin/profile` - Get admin profile
- PATCH `/api/admin/profile` - Update admin profile
- GET `/api/admin/register` - Get all registered students
- POST `/api/admin/register/new` - Register new student
- PATCH `/api/admin/register/:s_id` - Update student credentials
- DELETE `/api/admin/register/:s_id` - Delete student
- GET `/api/admin/record` - Get all student records
- GET `/api/admin/record/:s_id` - Get specific student record
- PATCH `/api/admin/record/:s_id` - Update student record
- GET `/api/admin/upload` - Get all upload requests
- PATCH `/api/admin/upload/:v_id` - Verify upload request
- GET `/api/admin/notice` - Get all notices
- POST `/api/admin/notice` - Create notice
- DELETE `/api/admin/notice/:n_id` - Delete notice
- GET `/api/admin/logs` - Get system logs

### Student Endpoints
- POST `/api/record/setup` - Complete profile setup
- GET `/api/profile` - Get student profile
- PATCH `/api/profile` - Update student profile
- GET `/api/record` - Get student record
- PATCH `/api/record` - Update student record
- GET `/api/upload` - Get student upload requests
- POST `/api/upload` - Create upload request
- DELETE `/api/upload/:v_id` - Delete upload request
- GET `/api/notice` - Get all notices
- GET `/api/logs` - Get student activity logs

---

## 📊 Database Collections (MongoDB)

- **admins** - Admin accounts
- **logins** - Student login credentials
- **students** - Detailed student records (created after setup)
- **verifications** - Upload/verification requests
- **notices** - Announcements
- **logs** - System activity logs
- **counters** - Auto-increment IDs

---

## ⚠️ Common Issues

### "No students showing in Admin Panel"
**Solution**: Students must complete their profile setup after first login. Only then will they appear in Records page.

### "Can't login as student"
**Solution**: Admin must register the student account first from Students page.

### "Student stuck on setup page"
**Solution**: Fill ALL required fields including:
- Date of Birth
- Contact (10 digits)
- Gmail
- Complete Address (locality, city, district, state, pincode)
- About section

### "Upload request not showing"
**Solution**: Check if student has completed profile setup first. Setup is required before uploads.

---

## 🎨 Color Theme
- **Primary**: Royal Blue (#4169E1)
- **Accent**: Gold (#FFD700)
- **Background**: Gradient from Blue-50 to Amber-50

---

## 📝 Notes
- All students MUST complete profile setup before accessing other features
- Only admin can register new students
- Upload requests require admin approval
- All API calls use JWT authentication with HTTP-only cookies
- Frontend and backend must both be running for the system to work
