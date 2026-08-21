# CHAPTER 4: SYSTEM ANALYSIS AND DESIGN

---

## **4.1 Requirements Analysis**

### **4.1.1 Functional Requirements (FR)**

| FR # | Requirement Name | Description | Priority | Module |
|---|---|---|---|---|
| FR-1 | User Authentication | System shall support secure login with JWT tokens for both admin and student users | CRITICAL | Auth |
| FR-2 | Student Registration | Admins shall register new students with username, email, password generation | CRITICAL | User Mgmt |
| FR-3 | Profile Setup | Students shall complete comprehensive profile on first login | CRITICAL | Profile |
| FR-4 | Profile Management | Students shall be able to edit and update their complete profiles | IMPORTANT | Profile |
| FR-5 | Achievement Submission | Students shall submit achievements in predefined categories with documents | CRITICAL | Achievement |
| FR-6 | Multi-Category Support | System shall support Skills, Certificates, Projects, Internships, Results, Documents | CRITICAL | Achievement |
| FR-7 | File Upload | System shall handle secure file uploads with type and size validation | IMPORTANT | File Mgmt |
| FR-8 | Verification Workflow | Admins shall review and approve/reject/request revision on submissions | CRITICAL | Verification |
| FR-9 | Admin Feedback | Admins shall provide detailed feedback on rejected or unclear submissions | IMPORTANT | Verification |
| FR-10 | Submission Tracking | Students shall view status of all submissions (pending, approved, rejected) | IMPORTANT | Achievement |
| FR-11 | Portfolio Display | Students shall view their verified achievements in organized portfolio | IMPORTANT | Portfolio |
| FR-12 | Portfolio Export | System shall generate downloadable PDF version of student portfolio | MODERATE | Portfolio |
| FR-13 | Activity Logging | System shall log all admin actions, submissions, and logins with timestamps | CRITICAL | Logging |
| FR-14 | Notice Management | Admins shall create and publish notices/announcements | MODERATE | Notices |
| FR-15 | Search & Filter | System shall provide search and filtering across students and submissions | MODERATE | Search |
| FR-16 | Data Export | System shall support CSV/PDF export of student data and reports | MODERATE | Reporting |
| FR-17 | Password Reset | Users shall be able to reset forgotten passwords via secure link | IMPORTANT | Auth |
| FR-18 | Role Separation | System shall enforce strict separation between admin and student roles | CRITICAL | Auth |
| FR-19 | Bulk Operations | Admins shall perform bulk registrations and status updates | MODERATE | Admin |
| FR-20 | Analytics Dashboard | Admins shall view dashboard with key metrics and statistics | MODERATE | Analytics |

---

### **4.1.2 Non-Functional Requirements (NFR)**

| NFR Category | Requirement | Specification | Priority |
|---|---|---|---|
| **Performance** | Response Time | API response < 500ms for 95% requests; Page load < 3 seconds | CRITICAL |
| **Performance** | Throughput | Support minimum 100 concurrent users; 50 req/sec minimum | IMPORTANT |
| **Scalability** | Database | Support up to 10,000 student records with acceptable performance | IMPORTANT |
| **Scalability** | Horizontal | Backend can be deployed across multiple servers | MODERATE |
| **Availability** | Uptime | 99.5% monthly uptime target; < 4 hours downtime/month | IMPORTANT |
| **Reliability** | Data Backup | Daily automated backups; 7-day backup retention minimum | CRITICAL |
| **Reliability** | Error Handling | Graceful error handling; User-friendly error messages | IMPORTANT |
| **Security** | Authentication | JWT tokens with 24-hour expiry; Secure token refresh | CRITICAL |
| **Security** | Password Storage | Argon2 hashing with cost factor = 12; No plaintext storage | CRITICAL |
| **Security** | Data Encryption | HTTPS for all communications; SSL/TLS v1.2+ | CRITICAL |
| **Security** | Input Validation | All inputs validated with Zod schemas; SQL injection prevention | CRITICAL |
| **Security** | Access Control | RBAC enforced; Role-specific endpoint access | CRITICAL |
| **Security** | Session Management | Automatic logout after 30 minutes inactivity; Secure session storage | IMPORTANT |
| **Security** | Audit Trail | All authenticated actions logged; Logs tamper-protected | CRITICAL |
| **Security** | Data Privacy | FERPA-compliant handling; Student data not shared externally | CRITICAL |
| **Security** | Vulnerability Management | Regular security updates; No known OWASP Top 10 vulnerabilities | CRITICAL |
| **Usability** | Responsiveness | Works on desktop (1024+px), tablet (768px), mobile (320px) | IMPORTANT |
| **Usability** | Accessibility | WCAG 2.1 Level AA compliance; Screen reader compatible | IMPORTANT |
| **Usability** | Training | Admin can learn system with 4-6 hours training | IMPORTANT |
| **Usability** | Navigation | Intuitive menu structure; Breadcrumbs on all pages | MODERATE |
| **Usability** | Documentation | Comprehensive user guide; API documentation | IMPORTANT |
| **Maintainability** | Code Quality | ESLint rules complied; Prettier formatted; >70% test coverage | IMPORTANT |
| **Maintainability** | Error Logs | Centralized error logging; Stack traces preserved | IMPORTANT |
| **Maintainability** | Code Comments | Inline comments for complex logic; Function documentation | MODERATE |
| **Compatibility** | Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) | IMPORTANT |
| **Compatibility** | Browser Support | IE11 not supported; Graceful degradation | MINOR |
| **Portability** | Deployment | Can be deployed on Linux/Windows servers | IMPORTANT |
| **Portability** | Database | MongoDB; No vendor-specific features | MODERATE |
| **Compliance** | Education Standards | Aligns with BTU and institutional guidelines | IMPORTANT |
| **Compliance** | Data Protection | Complies with institutional privacy policies | CRITICAL |

---

### **4.1.3 User Requirements**

#### **Administrator User Requirements:**

1. **Efficiency**
   - Minimize time for student registration (target: 1 minute per student)
   - Quick verification process (target: review in 5 minutes)
   - Bulk operations to manage multiple students simultaneously

2. **Control**
   - Full visibility into all student submissions
   - Granular control over approval process
   - Ability to customize verification workflow

3. **Accountability**
   - Complete audit trail of all actions
   - Cannot delete or modify logs
   - Clear responsibility assignment

4. **Reporting**
   - Easy-to-understand dashboards
   - Exportable reports for institutional use
   - Metrics on student achievements

5. **Support**
   - Clear documentation
   - Minimal training required
   - 24/7 troubleshooting capability

#### **Student User Requirements:**

1. **Simplicity**
   - Easy profile completion process
   - Simple achievement submission
   - Clear status of submitted items

2. **Transparency**
   - Understand why submissions are rejected
   - Track status in real-time
   - Clear guidelines for submissions

3. **Accessibility**
   - Access portfolio anytime, anywhere
   - Works on mobile phones
   - Downloadable portfolio format

4. **Privacy**
   - Control over who sees portfolio
   - Secure document storage
   - No unauthorized sharing

5. **Support**
   - Clear help documentation
   - Contact support mechanism
   - FAQ section

---

## **4.2 System Architecture Diagram**

```
────────────────────────────────────────────────────────────
CLIENT LAYER (Frontend)
────────────────────────────────────────────────────────────

    ┌──────────────────────────────────────────┐
    │        Web Browser (Client Side)          │
    │  ┌──────────────────────────────────────┐ │
    │  │    React.js Single Page App (SPA)     │ │
    │  │  Components + Hooks + State Mgmt      │ │
    │  └──────────────────────────────────────┘ │
    │  ┌──────────────────────────────────────┐ │
    │  │     Tailwind CSS + Shadcn UI         │ │
    │  │   (Responsive Design, Components)    │ │
    │  └──────────────────────────────────────┘ │
    │  ┌──────────────────────────────────────┐ │
    │  │    Axios HTTP Client                 │ │
    │  │  (API Communication)                 │ │
    │  └──────────────────────────────────────┘ │
    └──────────────────────────────────────────┘
                        ↓
            (HTTPS, JSON Data Exchange)
                        ↓
────────────────────────────────────────────────────────────
APPLICATION LAYER (Backend)
────────────────────────────────────────────────────────────

    ┌──────────────────────────────────────────┐
    │      Express.js Server (Node.js)          │
    │  ┌──────────────────────────────────────┐ │
    │  │   Routing Layer                       │ │
    │  │  (API Endpoints, Route Handlers)      │ │
    │  └──────────────────────────────────────┘ │
    │  ┌──────────────────────────────────────┐ │
    │  │   Middleware Layer                    │ │
    │  │  Auth, Validation, Logging, CORS      │ │
    │  └──────────────────────────────────────┘ │
    │  ┌──────────────────────────────────────┐ │
    │  │   Controller Layer                    │ │
    │  │  (Business Logic, Request Handling)   │ │
    │  │  - Auth Controller                    │ │
    │  │  - User Controller                    │ │
    │  │  - Achievement Controller             │ │
    │  │  - Verification Controller            │ │
    │  │  - Logging Controller                 │ │
    │  └──────────────────────────────────────┘ │
    │  ┌──────────────────────────────────────┐ │
    │  │   Service Layer                       │ │
    │  │  (Data Operations, Processing)        │ │
    │  │  - User Service                       │ │
    │  │  - Achievement Service                │ │
    │  │  - Email Service                      │ │
    │  └──────────────────────────────────────┘ │
    │  ┌──────────────────────────────────────┐ │
    │  │   Utility & Helper Functions          │ │
    │  │  (Validation, Encryption, Helpers)    │ │
    │  └──────────────────────────────────────┘ │
    └──────────────────────────────────────────┘
                        ↓
            (MongoDB Query Protocol)
                        ↓
────────────────────────────────────────────────────────────
DATA LAYER (Database & Storage)
────────────────────────────────────────────────────────────

    ┌──────────────────────────────────────────┐
    │       MongoDB Database                    │
    │  ┌──────────────────────────────────────┐ │
    │  │   Collections                         │ │
    │  │  ┌─────────────┐  ┌──────────────┐   │ │
    │  │  │ Admin       │  │ Student      │   │ │
    │  │  │ Collection  │  │ Collection   │   │ │
    │  │  └─────────────┘  └──────────────┘   │ │
    │  │  ┌─────────────┐  ┌──────────────┐   │ │
    │  │  │ Verify      │  │ Notice       │   │ │
    │  │  │ Request     │  │ Collection   │   │ │
    │  │  │ Collection  │  │              │   │ │
    │  │  └─────────────┘  └──────────────┘   │ │
    │  │  ┌─────────────────────────────────┐ │ │
    │  │  │ Logs Collection                 │ │ │
    │  │  │ Activity Audit Trail            │ │ │
    │  │  └─────────────────────────────────┘ │ │
    │  └──────────────────────────────────────┘ │
    │  ┌──────────────────────────────────────┐ │
    │  │   File Storage                        │ │
    │  │  /public/uploads/                     │ │
    │  │  (User Uploaded Documents)            │ │
    │  └──────────────────────────────────────┘ │
    │  ┌──────────────────────────────────────┐ │
    │  │   Indices & Optimization              │ │
    │  │  (Performance Tuning)                 │ │
    │  └──────────────────────────────────────┘ │
    └──────────────────────────────────────────┘

────────────────────────────────────────────────────────────
```

---

## **4.3 Use Case Diagram**

### **Use Case 1: Student Workflow**

```
                      ┌─────────────────┐
                      │   Student     │
                      └────────┬────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
              ┌─────▼──┐  ┌───▼────┐  ┌──▼────┐
              │ Login  │  │ Create │  │Submit │
              │System  │  │Profile │  │Achievement
              └─────┬──┘  └───┬────┘  └──┬────┘
                   │          │         │
              ┌────▼──────────▼─────────▼────┐
              │   Student Portal              │
              │  - Dashboard                  │
              │  - Profile Management        │
              │  - Achievement Submission    │
              │  - Portfolio Viewing         │
              └────┬──────────┬─────────┬───┘
                   │          │         │
            ┌──────▼─┐  ┌────▼──┐  ┌──▼──────┐
            │ View   │  │Track  │  │Download│
            │ My Work│  │Status │  │Portfolio
            └────────┘  └───────┘  └────────┘
```

### **Use Case 2: Admin Workflow**

```
                      ┌─────────────────┐
                      │ Administrator   │
                      └────────┬────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
         ┌────▼──────┐  ┌─────▼────┐  ┌──────▼────┐
         │ Register  │  │ Review    │  │ Manage    │
         │ Students  │  │Submissions│  │ System    │
         └────┬──────┘  └─────┬────┘  └──────┬────┘
              │               │              │
         ┌────▼───────────────▼──────────────▼────┐
         │    Admin Dashboard                      │
         │  - Student Management                  │
         │  - Verification Queue                  │
         │  - Notice Management                   │
         │  - Activity Logs      │
         │  - Reports & Analytics│
         └────┬──────┬───────┬──────┬─────────────┘
              │      │       │      │
        ┌─────▼─┐  ┌─▼───┐ ┌─▼──┐ ┌▼─────┐
        │Approve│  │View │ │Send│ │Export│
        │Request│  │Logs │ │Notice│Data
        └───────┘  └────┘ └────┘ └──────┘
```

---

## **4.4 Data Flow Diagram (DFD)**

### **Level 0: Context Diagram**

```
    ┌──────────────────────────────────────────┐
    │                                          │
    │      External Actors                     │
    │      (User Inputs)                       │
    │                                          │
    │  [Student User] [Admin User] [Guest]    │
    │          │             │         │      │
    └──────────┼─────────────┼─────────┼──────┘
               │             │         │
        ┌──────▼─────────────▼─────────▼──────┐
        │                                      │
        │     SPAM System (Main Process)      │
        │                                      │
        │   Manages Portfolios,               │
        │   Tracks Achievements,              │
        │   Verifies Submissions,             │
        │   Handles Authentication            │
        │                                      │
        └──────┬─────────────┬─────────┬──────┘
               │             │         │
       ┌───────▼──┐  ┌──────▼──┐  ┌──▼────────┐
       │ MongoDB  │  │External │  │ Logs      │
       │Database  │  │Files(*)  │  │Archive   │
       └──────────┘  └─────────┘  └───────────┘
       (*) Optional Cloud Storage
```

### **Level 1: Process Decomposition**

```
                    User Input
                    (Request)
                       │
         ┌─────────────▼─────────────┐
         │  1. Authentication &       │
         │     Authorization          │
         │  - Validate JWT            │
         │  - Check Role              │
         │  - Verify Permissions      │
         └─────────────┬──────────────┘
                       │ (Authenticated Request)
         ┌─────────────▼──────────────┐
         │  2. Input Validation       │
         │  - Zod Schema Check        │
         │  - Data Sanitization       │
         │  - File Type Validation    │
         └─────────────┬──────────────┘
                       │ (Valid Data)
         ┌─────────────▼──────────────┐
         │  3. Business Logic         │
         │     Processing             │
         │  - Data Processing         │
         │  - Calculations            │
         │  - Verification Checks     │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │  4. Database Operations    │
         │  - CRUD Operations         │
         │  - Data Persistence        │
         │  - Index Usage             │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │  5. Activity Logging       │
         │  - Log Action              │
         │  - Timestamp Record        │
         │  - Status Tracking         │
         └─────────────┬──────────────┘
                       │
         ┌─────────────▼──────────────┐
         │  6. Response Generation    │
         │  - Format Response         │
         │  - Status Code             │
         │  - Error Handling          │
         └─────────────┬──────────────┘
                       │
                User Response
                (JSON/HTML)
```

---

## **4.5 Entity Relationship Diagram (ERD)**

```
┌─────────────────────────────────────────────────────────────────┐
│                       Database Schema                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     ADMIN        │
└──────────────────┘
│ a_id (PK)       │
│ name            │
│ contact         │
│ email (UNIQUE)  │
│ username        │
│ password        │
│ role            │
└────────┬─────────┘
         │ 1:N
         │ Creates/Manages
         │
┌────────▼──────────────────┐
│      STUDENT              │
└───────────────────────────┘
│ s_id (PK, UNIQUE)        │
│ name (firstName,          │
│       middleName,         │
│       lastName)           │
│ email (UNIQUE)            │
│ contact                   │
│ dob                       │
│ age                       │
│ address { }              │
│ class                     │
│ branch                    │
│ profile                   │
│ image                     │
└────────┬──────────────────┘
         │
         │ 1:N
         │ Submits
         │
┌────────▼──────────────────┐
│   VERIFY_REQUEST          │
└───────────────────────────┘
│ v_id (PK)                │
│ s_id (FK→Student)        │
│ a_id (FK→Admin)          │
│ category                 │
│ body { }                │
│ status                   │
│ feedback                 │
│ created_at               │
│ resolved_at              │
└────────┬──────────────────┘

┌──────────────────┐
│     LOGIN        │
└──────────────────┘
│ s_id (FK)       │
│ username        │
│ password        │
│ role            │
└──────────────────┘

┌──────────────────┐
│      LOGS        │
└──────────────────┘
│ log_id (PK)     │
│ s_id (FK)       │
│ a_id (FK)       │
│ action          │
│ timestamp       │
│ ip_address      │
│ status          │
└──────────────────┘

┌──────────────────┐
│     NOTICE       │
└──────────────────┘
│ n_id (PK)       │
│ a_id (FK)       │
│ title           │
│ content         │
│ created_at      │
│ visible_to[ ]  │
└──────────────────┘
```

---

## **4.6 Database Design**

(Detailed database schema will be in separate technical documentation)

### **Collections Summary:**

1. **Admin Collection** - Administrator accounts and credentials
2. **Student Collection** - Comprehensive student profiles
3. **Verify Request Collection** - Achievement submission requests
4. **Login Collection** - Authentication credentials
5. **Logs Collection** - Activity audit trail
6. **Notice Collection** - Administrative announcements

---

## **4.7 Technology Stack / Tools and Technologies Used**

### **Frontend Technologies:**

| Technology | Purpose | Version | Justification |
|---|---|---|---|
| **React.js** | UI Framework | 18.x | Component-based, large ecosystem, excellent for SPAs |
| **Vite** | Build & Dev Tool | 5.x | Lightning-fast development, optimized builds |
| **Tailwind CSS** | Styling Framework | 3.x | Utility-first, responsive, rapid development |
| **Shadcn/ui** | UI Components | Latest | Pre-built accessible components |
| **Axios** | HTTP Client | 1.x | Promise-based, interceptors, better DX |
| **React Router** | Navigation | 6.x | Client-side routing, intuitive API |
| **React Query** | Data Fetching | 4.x | Server state management, caching |

### **Backend Technologies:**

| Technology | Purpose | Version | Justification |
|---|---|---|---|
| **Node.js** | Runtime | 18+ LTS | JavaScript everywhere, event-driven architecture |
| **Express.js** | Web Framework | 4.x | Lightweight, flexible, middleware support |
| **JWT** | Authentication | - | Stateless, scalable, industry standard |
| **Argon2** | Password Hashing | - | Modern, secure, resistant to GPU attacks |
| **Zod** | Data Validation | - | TypeScript-first, excellent DX |
| **Multer** | File Upload | - | Simple, middleware-based file handling |
| **Morgan** | HTTP Logging | - | Request logging for debugging |
| **dotenv** | Environment Config | - | Secure configuration management |

### **Database & Storage:**

| Technology | Purpose | Version | Justification |
|---|---|---|---|
| **MongoDB** | Primary Database | 5.x+ | Flexible schema, document-oriented,Scalable |
| **Mongoose** | ODM Library | 7.x | Schema validation, hooks, modeling |
| **Node File System** | Local Storage | - | Simple file management on server |

### **Development & Testing Tools:**

| Technology | Purpose | Category | Justification |
|---|---|---|---|
| **Git** | Version Control | SCM | Industry standard, distributed |
| **GitHub/GitLab** | Repository Hosting | SCM | Free, collaborative, CI/CD integration |
| **ESLint** | Code Linting | Code Quality | Identify bugs, enforce standards |
| **Prettier** | Code Formatting | Code Quality | Consistent formatting, saves time |
| **Jest** | Unit Testing | Testing | Excellent JavaScript testing framework |
| **React Testing Library** | Component Testing | Testing | Best practices for testing React |
| **Postman** | API Testing | Testing | Visual API testing, documentation |
| **Docker** | Containerization | DevOps | Consistent deployment, easy scaling |

### **Infrastructure & Deployment:**

| Technology | Purpose | Alternative |
|---|---|---|
| **Linux Server** | Hosting OS | Windows, macOS |
| **Nginx/Apache** | Web Server | Node.js built-in |
| **SSL/TLS** | Encryption | Let's Encrypt (free) |
| **MongoDB Atlas** | Cloud Database | Self-hosted MongoDB |
| **AWS/Azure/GCP** | Cloud Hosting | On-premises server |

---

**Submitted By:**
- Kanishk Sharma (Roll No. 23EAJCS022)
- Harsh Tailor (Roll No. 23EAJCS018)

**Under the Guidance of:**
- Prof. Prakash Sharma

**Institution:**
- Aryabhatta College of Engineering
- Bikaner Technical University

