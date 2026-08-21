# APPENDICES

---

## **APPENDIX A: Database Schema Scripts**

### **MongoDB Connection String:**
```
mongodb://localhost:27017/spam
```

### **Database Initialization Script (createCollections.js)**
```javascript
// Connect to MongoDB
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spam';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Import models
const Admin = require('./models/adminModel');
const Student = require('./models/studentModel');
const VerifyRequest = require('./models/verifyModel');
const Login = require('./models/loginModel');
const Logs = require('./models/logsModel');
const Notice = require('./models/noticeModel');

// Create indexes for better performance
async function createIndexes() {
  // Admin indexes
  Admin.collection.createIndex({ email: 1 }, { unique: true });
  Admin.collection.createIndex({ username: 1 }, { unique: true });

  // Student indexes
  Student.collection.createIndex({ s_id: 1 }, { unique: true });
  Student.collection.createIndex({ email: 1 }, { unique: true });

  // VerifyRequest indexes
  VerifyRequest.collection.createIndex({ v_id: 1 }, { unique: true });
  VerifyRequest.collection.createIndex({ s_id: 1 });
  VerifyRequest.collection.createIndex({ status: 1 });

  // Logs indexes
  Logs.collection.createIndex({ timestamp: 1 });
  Logs.collection.createIndex({ s_id: 1 });

  console.log('All indexes created successfully');
}

createIndexes();
```

### **Default Admin Account Creation Script**
```javascript
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel');

async function createDefaultAdmin() {
  try {
    const adminExists = await Admin.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const defaultAdmin = new Admin({
        name: 'System Administrator',
        contact: '9999999999',
        email: 'admin@spam.edu',
        image: '/defaultProfile.png',
        username: 'admin',
        password: 'Admin@123', // Will be hashed by pre-save hook
        role: 'admin'
      });
      
      await defaultAdmin.save();
      console.log('Default admin account created successfully');
      console.log('Username: admin');
      console.log('Password: Admin@123');
    } else {
      console.log('Default admin account already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

module.exports = createDefaultAdmin;
```

---

## **APPENDIX B: API Endpoint Specifications**

### **Authentication Endpoints**
```
POST   /api/auth/login              - User login (Admin/Student)
POST   /api/auth/logout             - User logout
POST   /api/auth/register           - Register new user (admin only)
POST   /api/auth/refresh-token      - Refresh JWT token
POST   /api/auth/reset-password     - Password reset request
PUT    /api/auth/update-password    - Update password (authenticated)
GET    /api/auth/verify             - Verify JWT token validity
```

### **Admin Management Endpoints**
```
POST   /api/admin/register-student  - Register new student (bulk supported)
GET    /api/admin/students          - List all students (with filters)
GET    /api/admin/students/:id      - Get student details
PUT    /api/admin/students/:id      - Update student details
DELETE /api/admin/students/:id      - Deactivate student account
POST   /api/admin/students/:id/reset-password - Reset student password
GET    /api/admin/students/search   - Search students by criteria
```

### **Verification Endpoints**
```
GET    /api/admin/verify-requests   - Get all pending verifications
GET    /api/admin/verify-requests/:vid - Get specific verification details
PUT    /api/admin/verify/:vid       - Approve/Reject/Request revision
GET    /api/admin/verify/status/:sid - Get all verifications for student
POST   /api/admin/verify/bulk       - Bulk approve/reject operations
```

### **Student Endpoints**
```
GET    /api/student/profile         - Get own profile
PUT    /api/student/profile         - Update own profile
POST   /api/student/setup           - Complete initial profile setup
GET    /api/student/achievements    - List own achievements
POST   /api/student/achievements    - Submit new achievement for verification
GET    /api/student/portfolio       - Get verified portfolio
GET    /api/student/verifications   - Track verification status of submissions
```

### **File Upload Endpoints**
```
POST   /api/upload/:type            - Upload file for specific achievement type
GET    /api/download/:fileId        - Download file (authenticated)
DELETE /api/files/:fileId           - Delete uploaded file
```

### **Notice Endpoints**
```
POST   /api/notices                 - Create notice (admin only)
GET    /api/notices                 - List all notices
PUT    /api/notices/:id             - Edit notice (admin only)
DELETE /api/notices/:id             - Delete notice (admin only)
GET    /api/notices/:id             - Get notice details
POST   /api/notices/:id/read        - Mark notice as read
```

### **Logging & Analytics Endpoints**
```
GET    /api/logs                    - Get activity logs (admin only)
GET    /api/logs/filter             - Filter logs by criteria
GET    /api/analytics/dashboard     - Get dashboard metrics
GET    /api/analytics/students      - Student achievement statistics
GET    /api/analytics/verification  - Verification workflow analytics
POST   /api/export/report           - Export report (CSV/PDF)
```

---

## **APPENDIX C: Installation & Setup Guide**

### **System Requirements**
```
Operating System: Linux/Windows/macOS
Processor: 2+ cores, 2GHz minimum
RAM: 4GB minimum, 8GB recommended
Storage: 20GB free space minimum
Node.js: Version 18+ LTS
MongoDB: Version 5.0+
```

### **Step-by-Step Installation**

**Step 1: Clone Repository**
```bash
git clone https://github.com/your-org/SPAM.git
cd SPAM
```

**Step 2: Install Dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd SPAM_Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install

# Return to root directory
cd ..
```

**Step 3: Configure Environment Variables**

**Backend .env file (SPAM_Backend/.env):**
```
MONGODB_URI=mongodb://localhost:27017/spam
PORT=3000
NODE_ENV=development
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=24h
ADMIN_EMAIL=admin@spam.edu
ADMIN_DEFAULT_PASSWORD=Admin@123
```

**Frontend .env file (Frontend/.env):**
```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=SPAM
VITE_APP_VERSION=1.0.0
```

**Step 4: Start MongoDB**
```bash
# Linux/macOS
mongod

# Windows
mongod.exe
```

**Step 5: Initialize Database**
```bash
# From project root
node SPAM_Backend/scripts/createDefaultAdmin.js
```

**Step 6: Start Application**
```bash
# Start both backend and frontend
npm start

# Or start individually:
npm run start:backend    # Terminal 1
npm run start:frontend   # Terminal 2
```

**Step 7: Verify Installation**
- Open browser and go to http://localhost:5173
- Login with default credentials:
  - Username: `admin`
  - Password: `Admin@123`

---

## **APPENDIX D: Sample User Credentials**

### **Default Admin Account**
```
Role: Administrator
Username: admin
Password: Admin@123
Email: admin@spam.edu
```

### **Sample Student Account (To be created by admin)**
```
Role: Student
Username: student001
Password: Student@123 (Initial)
Name: John Doe
Roll No: 23EAJCS001
```

### **Testing Credentials Matrix**

| User Type | Username | Password | Module Access |
|---|---|---|---|
| Admin | admin | Admin@123 | Admin Dashboard, Verification, Reporting |
| Student | student001 | Student@123 | Profile, Achievement, Portfolio |
| Admin2 | admin2 | Admin@123 | Admin Dashboard (with limited permissions) |
| Student2 | student002 | Student@123 | Profile, Achievement, Portfolio |

---

## **APPENDIX E: Code Snippets**

### **1. Password Hashing Implementation (Backend)**
```javascript
// utils/passwordUtils.js
const argon2 = require('argon2');

const hashPassword = async (password) => {
  try {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 65536 KB
      timeCost: 3,
      parallelism: 1
    });
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

const verifyPassword = async (password, hash) => {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    throw new Error(`Error verifying password: ${error.message}`);
  }
};

module.exports = { hashPassword, verifyPassword };
```

### **2. JWT Authentication Middleware (Backend)**
```javascript
// middleware/authCheck.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(403).json({ error: 'Invalid token' });
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };
```

### **3. Zod Input Validation Schema (Backend)**
```javascript
// validator/loginSchema.js
const { z } = require('zod');

const loginSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
  
  role: z.enum(['admin', 'student'], 'Invalid role selected')
});

const validateLogin = (data) => {
  try {
    return loginSchema.parse(data);
  } catch (error) {
    throw new Error(error.errors[0].message);
  }
};

module.exports = { loginSchema, validateLogin };
```

### **4. Login Component (Frontend - React)**
```javascript
// Frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        formData
      );

      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', formData.role);
      localStorage.setItem('userId', response.data.userId);

      // Redirect based on role
      if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">SPAM System</h1>
        
        <form onSubmit={handleLogin}>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
```

---

## **APPENDIX F: Testing Checklist**

### **Pre-Deployment Testing Checklist**

**Authentication Testing:**
- [ ] Admin can login with correct credentials
- [ ] Student can login with correct credentials
- [ ] Login fails with incorrect password
- [ ] Login fails with non-existent username
- [ ] JWT token is generated correctly
- [ ] Token expires after 24 hours
- [ ] Token can be refreshed
- [ ] Logout clears session

**Student Management Testing:**
- [ ] Admin can register new students
- [ ] Student username validation (unique, length)
- [ ] Student email validation (unique, format)
- [ ] Student password hashing works correctly
- [ ] Student profile completion is mandatory on first login
- [ ] Student can update profile information
- [ ] Student cannot update others' profiles

**Achievement System Testing:**
- [ ] Student can submit achievement in each category
- [ ] File upload works for supported formats
- [ ] File upload rejects oversized files
- [ ] File upload rejects invalid file types
- [ ] Achievement submission data is validated
- [ ] Student can edit pending submissions
- [ ] Student cannot delete approved submissions

**Admin Verification Testing:**
- [ ] Admin can view pending submissions list
- [ ] Admin can view submission details and documents
- [ ] Admin can approve submissions
- [ ] Admin can reject submissions with feedback
- [ ] Admin can request revision
- [ ] Admin feedback is visible to student
- [ ] Verification status updates in real-time

**Security Testing:**
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are blocked
- [ ] CSRF tokens work correctly
- [ ] Unauthorized access is prevented
- [ ] Role-based access control is enforced
- [ ] User cannot access others' data
- [ ] Admin actions are logged

**Performance Testing:**
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] System handles 100+ concurrent users
- [ ] Database queries are optimized
- [ ] Memory usage is stable

**UI/UX Testing:**
- [ ] UI works on desktop (1920x1080)
- [ ] UI works on tablet (768px)
- [ ] UI works on mobile (375px)
- [ ] Forms provide clear validation messages
- [ ] Error messages are user-friendly
- [ ] Navigation is intuitive

---

## **APPENDIX G: Project File Structure**

```
SPAM/
│
├── SPAM_Backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── controller/
│   │   ├── admin/
│   │   │   ├── registerController.js
│   │   │   ├── profileController.js
│   │   │   ├── noticeController.js
│   │   │   ├── recordController.js
│   │   │   └── uploadController.js
│   │   ├── student/
│   │   │   ├── profileController.js
│   │   │   ├── noticeController.js
│   │   │   └── uploadController.js
│   │   ├── loginUserController.js
│   │   └── logoutUserController.js
│   │
│   ├── middleware/
│   │   ├── authCheck.js          # JWT verification
│   │   └── upload.js             # File upload handling
│   │
│   ├── model/
│   │   ├── adminModel.js
│   │   ├── studentModel.js
│   │   ├── loginModel.js
│   │   ├── verifyModel.js
│   │   ├── logsModel.js
│   │   └── noticeModel.js
│   │
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── adminRouter.js
│   │   │   ├── registerRoute.js
│   │   │   ├── profileRoute.js
│   │   │   ├── noticeRoute.js
│   │   │   ├── recordRoute.js
│   │   │   └── uploadRoute.js
│   │   └── student/
│   │       ├── studentRouter.js
│   │       ├── profileRoute.js
│   │       ├── noticeRoute.js
│   │       └── uploadRoute.js
│   │
│   ├── utils/
│   │   ├── calculateAge.js
│   │   ├── logs.js
│   │   └── zodValidator.js
│   │
│   ├── validator/
│   │   ├── loginSchema.js
│   │   └── admin/
│   │       ├── registerStudentSchema.js
│   │       ├── editProfileSchema.js
│   │       └── verifyRequestSchema.js
│   │
│   ├── public/
│   │   └── uploads/              # Uploaded files storage
│   │
│   ├── app.js                     # Express app setup
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   └── ui/
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── alert.jsx
│   │   │       └── [other UI components]
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── StudentManagement.jsx
│   │   │   │   ├── VerificationPanel.jsx
│   │   │   │   └── ...
│   │   │   └── student/
│   │   │       ├── StudentDashboard.jsx
│   │   │       ├── ProfileSetup.jsx
│   │   │       ├── UploadAchievement.jsx
│   │   │       └── PortfolioView.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── use-mobile.js
│   │   │
│   │   ├── lib/
│   │   │   └── [utility functions]
│   │   │
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── SPAM_DETAILED_SYNOPSIS/        # This documentation
│   ├── 01_TITLE_PAGE.md
│   ├── 02_CERTIFICATE.md
│   ├── 03_DECLARATION.md
│   ├── 04_ACKNOWLEDGEMENT.md
│   ├── 05_TABLE_OF_CONTENTS.md
│   ├── 06_LIST_OF_FIGURES_AND_TABLES_ABBREVIATIONS.md
│   ├── 07_CHAPTER_1_INTRODUCTION.md
│   ├── 08_CHAPTER_2_LITERATURE_SURVEY.md
│   ├── 09_CHAPTER_3_PROPOSED_SYSTEM.md
│   ├── 10_CHAPTER_4_SYSTEM_ANALYSIS_AND_DESIGN.md
│   ├── 11_CHAPTER_5_IMPLEMENTATION_PLAN.md
│   ├── 12_CHAPTER_6_EXPECTED_OUTCOMES.md
│   ├── 13_REFERENCES.md
│   └── 14_APPENDICES.md (this file)
│
├── package.json (root)
├── start.bat
├── start.ps1
├── README.md
├── .gitignore
└── .github/
    └── workflows/
        ├── ci.yml                # CI/CD pipeline
        └── deploy.yml            # Deployment automation
```

---

## **APPENDIX H: Troubleshooting Guide**

### **Common Issues & Solutions**

**Issue 1: MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running (`mongod` or `mongod.exe`)
- Check MongoDB service status
- Verify connection string in .env file
- Check firewall settings

**Issue 2: Port Already in Use**
```
Error: listen EADDRINUSE :::3000
```
**Solution:**
- Kill process using port 3000:
  ```bash
  # Linux/macOS
  lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
  
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```
- Or change PORT in .env file

**Issue 3: CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check CORS configuration in Express server
- Ensure frontend and backend URLs match in .env
- Verify middleware order in app.js

**Issue 4: JWT Token Expired**
```
Error: jwt expired
```
**Solution:**
- Token refresh endpoint needs to be called
- Check JWT_EXPIRE setting in .env
- Clear localStorage and login again

---

**Total Pages (when printed to PDF): 28-32 pages**

**Document Complete!**

---

**Submitted By:**
- Kanishk Sharma (Roll No. 23EAJCS022)
- Harsh Tailor (Roll No. 23EAJCS018)

**Under the Guidance of:**
- Prof. Prakash Sharma

**Institution:**
- Aryabhatta College of Engineering
- Bikaner Technical University

**Date of Submission:** April 2026

