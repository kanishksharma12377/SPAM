# CHAPTER 3: PROPOSED SYSTEM

---

## **3.1 Overview of Proposed System**

The **Student Portfolio & Achievement Management System (SPAM)** is a comprehensive, production-ready full-stack web application that addresses the critical challenge of student achievement tracking and portfolio management in educational institutions.

### **System Definition:**

SPAM is a modern web-based platform built on the MERN stack (MongoDB, Express.js, React.js, Node.js) that enables:
- **Students** to create comprehensive digital portfolios and submit achievements for verification
- **Administrators** to manage students, verify submissions, and track institutional metrics
- **Institutions** to maintain data integrity, security, and accessibility

### **Architecture Overview:**

#### **Frontend Architecture**
```
React.js + Vite → Component-Based UI
    ↓
Tailwind CSS + Shadcn/ui → Responsive Design
    ↓
State Management (React Hooks) → Application State
    ↓
Axios HTTP Client → API Communication
```

#### **Backend Architecture**
```
Express.js Routing → API Endpoints
    ↓
Middleware Layer → Authentication, Validation, Logging
    ↓
Business Logic Layer → Controllers & Services
    ↓
Data Persistence → MongoDB with Mongoose ODM
```

#### **Security Architecture**
```
JWT Authentication → Stateless User Sessions
    ↓
Argon2 Password Hashing → Secure Credential Storage
    ↓
Zod Schema Validation → Input Sanitization
    ↓
RBAC → Role-Based Access Control
```

### **Core Workflow**

```
┌─────────────────────────────────────────────────────────┐
│         SPAM System Workflow Overview                   │
└─────────────────────────────────────────────────────────┘

[1] ADMIN REGISTRATION (Pre-deployment)
    └─ Default admin account: username: admin, password: Admin@123

[2] STUDENT REGISTRATION (By Admin)
    └─ Admin creates student accounts with credentials

[3] STUDENT PROFILE SETUP (First Login)
    └─ Student completes personal & academic profile

[4] ACHIEVEMENT SUBMISSION (Ongoing)
    ├─ Student submits achievements with documents
    └─ Categorized: Skills, Certificates, Projects, Internships, Results

[5] ADMIN VERIFICATION (Asynchronous)
    ├─ Review submissions
    ├─ Approve/Reject with feedback
    └─ Update verification status

[6] PORTFOLIO DISPLAY (Real-time)
    └─ Student views verified achievements

[7] ACTIVITY TRACKING (Continuous)
    └─ System logs all actions for audit
```

---

## **3.2 Features of Proposed System**

### **3.2.1 Features for Students**

#### **1. Secure Authentication & Profile Management**
- **User Registration:** Initial password setup by admin
- **Secure Login:** JWT-based authentication with automatic logout
- **Profile Completion:** Comprehensive profile with:
  - Personal Information (Name, DOB, Contact)
  - Academic Details (Class, Branch, Roll No.)
  - Address Information (Locality, City, State, Pincode)
  - Social Media Links (LinkedIn, GitHub, Portfolio Website)
  - Profile Picture
  - About/Bio Section
- **Password Management:** Change password, password reset functionality
- **Session Management:** Automatic timeout after inactivity

#### **2. Multi-Category Achievement Tracking**

**Skills Module:**
- Add technical skills (programming languages, frameworks)
- Add soft skills (communication, leadership)
- Organize by proficiency level (beginner, intermediate, expert)
- Document skill verification

**Academic Results Module:**
- Upload academic transcripts
- Record semester-wise performance
- Document GPA and percentages
- Upload digital certificates of achievement

**Certifications Module:**
- Add online course certificates (Coursera, Udemy, etc.)
- Record certification details (issuer, date, validity)
- Upload digital proof
- Organize by category (technical, professional development)

**Projects Module:**
- Document project title and description
- List technologies used
- Add project links (GitHub, deployed URLs, documentation)
- Upload project screenshots/demos
- Include team member information

**Internship Module:**
- Record company details and internship period
- Document role and responsibilities
- Upload internship certificate
- Add internship report/summary
- Include key learnings

**Additional Documents Module:**
- Store awards and recognitions
- Upload letters of recommendation
- Store participation certificates
- Archive miscellaneous achievements

#### **3. Portfolio Submission & Verification Workflow**
- **Submission Interface:** Simple form-based submission
- **Document Upload:** Support for PDF, Images, DOCX
- **Status Tracking:**
  - Pending (awaiting admin review)
  - Under Review (admin is reviewing)
  - Approved (accepted into portfolio)
  - Rejected (with feedback for improvement)
  - Revision Required (needs updates)
- **Feedback System:** View detailed feedback from admins
- **Resubmission:** Ability to modify and resubmit rejected items

#### **4. Digital Portfolio Display**
- **Personal Portfolio Page:** Comprehensive view of all approved achievements
- **Categorized Display:** Achievements organized by type
- **Visual Presentation:** Professional layout with thumbnails
- **Downloadable Portfolio:** Generate PDF version of portfolio
- **Public/Private Toggle:** Choose which items are publicly visible
- **Social Sharing:** Share portfolio link on social media

#### **5. Dashboard & Activity Management**
- **Student Dashboard:** Overview of:
  - Profile completion status
  - Total submissions (accepted, pending, rejected)
  - All achievements at a glance
  - Recent activity
  - Messages from admin
- **Submission Tracking:**
  - Chronological list of submissions
  - Filter by status and category
  - Sort by date or category
  - Export submission history
- **Analytics:**
  - Achievement statistics
  - Progress over semesters
  - Skill development tracking

#### **6. Notifications & Alerts**
- **Real-time Notifications:**
  - Submission approved
  - Submission rejected with feedback
  - Admin comment on submission
  - Profile completion reminders
- **Email Notifications:** Critical updates sent via email
- **In-app Notifications:** Real-time dashboard updates

#### **7. Search & Discovery**
- **Portfolio Search:** Full-text search across own portfolio
- **Achievement Filtering:** Filter by category, date, status
- **Export Functionality:** Download portfolio as PDF or print-friendly format

---

### **3.2.2 Features for Administrators**

#### **1. Student Management**
- **Student Registration:** Bulk registration with CSV upload
  - Auto-generate credentials
  - Send activation emails
  - Track registration status
- **Student Directory:** View all registered students
  - Filter by class, branch, year
  - Search by name/roll no.
  - View student profiles
  - View submission history
- **Profile Management:**
  - View student complete profiles
  - Edit student information if needed
  - Manage student status (active, inactive, graduated)
  - Deactivate accounts if necessary
- **Batch Operations:**
  - Reset passwords
  - Bulk enable/disable accounts
  - Export student lists

#### **2. Achievement Verification Workflow**
- **Submission Queue:**
  - View all pending submissions
  - Filter by student name, category, date
  - Sort by submission date or status
  - Quick preview of submission details
- **Review Interface:**
  - View submission details and documents
  - Preview uploaded files
  - Assessment checklist
  - Approval/Rejection buttons with comments
- **Verification Actions:**
  - Approve: Accept achievement into student portfolio
  - Reject: Decline with detailed feedback
  - Request Revision: Ask student to resubmit with changes
  - Requires Clarification: Ask questions before deciding
- **Feedback System:**
  - Detailed comment/feedback field
  - Suggestions for improvement
  - Links to resources
  - Follow-up communication
- **Bulk Operations:**
  - Approve multiple submissions
  - Batch reject with template feedback
  - Export verification reports

#### **3. Comprehensive Activity Logging**
- **Action Logging:**
  - Student login/logout tracking
  - Achievement submission logging
  - Verification actions (approve/reject/edit)
  - Profile update tracking
  - File upload/download logging
- **Admin Action Audit:**
  - All admin actions logged with timestamp
  - User identity recorded
  - Changes tracked before/after
  - Reversible operations tracked
- **Log Viewing:**
  - Filter by student, action type, date
  - Search functionality
  - Export logs to CSV
  - Real-time log dashboard
  - Log retention and archival

#### **4. Notice & Announcement Management**
- **Notice Creation:**
  - Rich text editor for content
  - Category assignment (academic, admin, etc.)
  - Priority levels (high, medium, low)
  - Scheduled publication
  - Target audience selection
- **Notice Distribution:**
  - Send to specific students/classes
  - Email notifications
  - In-app notifications
  - SMS notifications (if configured)
- **Notice Management:**
  - Edit existing notices
  - Archive old notices
  - View notice history
  - Track who read notices
  - Pin important notices

#### **5. Analytics & Reporting**
- **Dashboard Metrics:**
  - Total students registered
  - Total submissions (by category)
  - Verification status distribution
  - Most active students
  - Trending achievements
- **Statistical Reports:**
  - Student achievement statistics
  - Verification workflow metrics
  - Average submission review time
  - Approval/rejection rates by category
  - Time-based trends
- **Export Reports:**
  - Generate PDF reports
  - Export CSV data
  - Schedule automated reports
  - Email report delivery

#### **6. System Administration**
- **Admin Account Management:**
  - Create/edit admin accounts
  - Assign admin roles
  - Set permission levels
  - Admin activity audit trail
- **System Configuration:**
  - Define achievement categories
  - Set file upload limits
  - Configure notification settings
  - Manage system settings
  - Configure business rules
- **Backup & Recovery:**
  - Initiate manual backups
  - View backup history
  - Schedule automated backups
  - Track backup completion
- **System Monitoring:**
  - Server health dashboard
  - Database status
  - Error logs
  - Performance metrics
  - User activity summary

#### **7. Access Control & Security**
- **Role Management:**
  - Define different admin roles
  - Assign granular permissions
  - Super admin privileges
  - Verification officer permissions
  - Registration manager permissions
- **Two-layer Verification:**
  - Option for multiple reviewers
  - Approval chain setup
  - Final approval authority
  - Parallel review option
- **Data Protection:**
  - Password policy enforcement
  - Session timeout management
  - Activity monitoring
  - Suspicious activity alerts

---

## **3.3 Advantages of Proposed System over Existing Systems**

| Aspect | Advantage | Impact |
|---|---|---|
| **Cost** | 100% free, open-source | Reduces budget burden by ₹50,000-200,000/year |
| **Customization** | Full source code access | Adapt to institutional requirements without costly consulting |
| **Data Ownership** | On-premises deployment | Ensures data privacy and compliance |
| **Verification Workflow** | Structured multi-stage approval | Ensures quality and prevents fraudulent claims |
| **Admin Control** | Comprehensive management tools | Efficient administrative operations |
| **Security** | Industry-standard practices | Protects sensitive student information |
| **User Experience** | Modern, responsive design | Works seamlessly on all devices |
| **Quick Deployment** | Simple setup process | Operational within 24-48 hours |
| **Learning Value** | Educational codebase | CS students understand real-world development |
| **Scalability** | MERN stack architecture | Grows with institutional needs |
| **Support** | Community-driven | Available at no cost through open-source channels |
| **Integration** | Open APIs | Easy to connect with other systems |
| **Sustainability** | No vendor lock-in | Can be maintained in-house |
| **Performance** | Optimized stack | Fast response times and smooth UX |
| **Accessibility** | WCAG 2.1 compliant | Works for users with disabilities |

---

## **3.4 Methodology / Approach**

### **3.4.1 Development Methodology: Agile**

**Rationale for Agile Selection:**
- **Iterative Development:** Build features incrementally with regular feedback
- **Flexibility:** Adapt to changing requirements during development
- **Testing:** Continuous testing and quality assurance
- **Team Communication:** Regular standups and reviews
- **Risk Management:** Early identification and mitigation of issues

### **3.4.2 Sprint Planning**

**Sprint Duration:** 2 weeks per sprint  
**Total Sprints:** 8 sprints over 16 weeks

**Sprint Breakdown:**

| Sprint | Duration | Focus Area | Deliverables |
|---|---|---|---|
| 1 | Wk 1-2 | Planning & Setup | Requirements, Design Docs, Project Setup |
| 2 | Wk 3-4 | Backend Foundation | DB Schema, Auth APIs, Models |
| 3 | Wk 5-6 | Admin APIs | Student Mgmt, Verification APIs, Logging |
| 4 | Wk 7-8 | Student APIs | Profile, Achievement, Portfolio APIs |
| 5 | Wk 9-10 | Frontend Admin | Dashboard, Student Mgmt, Verification UI |
| 6 | Wk 11-12 | Frontend Student | Profile Setup, Achievement Submit, Portfolio |
| 7 | Wk 13-14 | Integration & Testing | API Integration, Unit Tests, UAT |
| 8 | Wk 15-16 | Deployment & Docs | Production Setup, Documentation, Training |

### **3.4.3 Development Practices**

**Version Control:**
- Git for source code management
- Feature branches for development
- Code reviews before merging
- Meaningful commit messages

**Code Quality:**
- ESLint for linting
- Prettier for code formatting
- Jest for unit testing
- React Testing Library for component tests

**Documentation:**
- Inline code comments
- API documentation with Postman
- README files for setup
- Architecture decision records (ADRs)

**Team Collaboration:**
- Daily 15-minute standups
- Weekly code reviews
- Bi-weekly sprint reviews
- Retrospectives for process improvement

### **3.4.4 Technology Stack Selection Rationale**

**Frontend: React.js + Vite**
- Modern component-based architecture
- Large ecosystem and community support
- Excellent developer tools
- Vite provides lightning-fast development

**Backend: Node.js + Express.js**
- JavaScript across full stack
- Non-blocking I/O for performance
- Rich middleware ecosystem
- Easy horizontal scaling

**Database: MongoDB**
- Flexible schema for evolving requirements
- Document-based suits our nested data
- Excellent for rapid development
- Good scalability

**Security: JWT + Argon2**
- Stateless authentication (scalable)
- Industry-standard password hashing
- No server-side session storage needed

**Styling: Tailwind CSS**
- Utility-first approach
- Mobile-responsive by default
- Excellent for rapid UI development
- Small bundle size

---

**Submitted By:**
- Kanishk Sharma (Roll No. 23EAJCS022)
- Harsh Tailor (Roll No. 23EAJCS018)

**Under the Guidance of:**
- Prof. Prakash Sharma

**Institution:**
- Aryabhatta College of Engineering
- Bikaner Technical University

