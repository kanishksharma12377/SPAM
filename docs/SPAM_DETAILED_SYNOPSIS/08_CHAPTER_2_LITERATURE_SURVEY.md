# CHAPTER 2: LITERATURE SURVEY / REVIEW OF EXISTING SYSTEMS

---

## **2.1 Study of Similar Existing Systems**

### **System 1: Blackboard Learn**

**Type:** Enterprise Learning Management System  
**Intended Use:** Comprehensive course and student management

**Key Features:**
- Course management and content delivery
- Student grade tracking and reporting
- Discussion forums and collaboration tools
- Mobile learning app
- Integration with institutional systems
- Advanced analytics dashboard

**Limitations:**
- Very expensive (enterprise licensing model)
- Overkill for student portfolio purposes
- Complex interface with steep learning curve
- Requires dedicated IT staff for maintenance
- Focus on course management, not achievement tracking

---

### **System 2: Canvas LMS**

**Type:** Cloud-based Learning Management Platform  
**Intended Use:** Course and learning content delivery

**Key Features:**
- User-friendly course interface
- Grade management
- Plagiarism detection
- Mobile responsiveness
- API for integrations
- Reasonably good support

**Limitations:**
- Significant annual subscription cost
- Cloud-based only (data outside institution control)
- Not specialized for portfolio management
- Limited achievement verification capabilities
- Generic learning focus

---

### **System 3: Portfolium**

**Type:** Digital Portfolio Platform  
**Intended Use:** Student portfolio creation and sharing

**Key Features:**
- Dedicated portfolio building tools
- Skill and achievement showcasing
- Professional templates
- Sharing and commenting features
- Analytics for portfolio views
- Mobile app available

**Limitations:**
- Subscription-based pricing model
- Cloud-only (limited data control)
- Cannot be customized for institutional branding
- Limited admin control and verification workflows
- Expensive for large institutions

---

### **System 4: Evernote**

**Type:** Note-Taking and Document Organization Tool  
**Intended Use:** Personal note and document management

**Key Features:**
- Note-taking and tagging
- Document clipping and saving
- Cross-device synchronization
- Good search capabilities
- Relatively affordable

**Limitations:**
- Not designed for institutional use
- No achievement verification mechanism
- Limited admin controls
- Weak collaboration features
- No structured workflows

---

### **System 5: Google Sites + Sheets**

**Type:** Free Web and Document Tools  
**Intended Use:** Website creation and data management

**Key Features:**
- Free to use
- Basic website creation
- Simple data management with sheets
- Good integration with Google ecosystem
- Accessible from anywhere

**Limitations:**
- Requires manual management
- No automated verification workflow
- Weak access control mechanisms
- Poor audit trail and logging
- Not scalable for institutions
- Data stored externally

---

## **2.2 Advantages and Disadvantages of Existing Systems**

### **Comprehensive Comparison Table**

| Aspect | Blackboard | Canvas | Portfolium | Evernote | Google Suite | **SPAM** |
|---|---|---|---|---|---|---|
| **Cost** | Very High | High | Medium | Low | Free | **Free** ✅ |
| **Licensing Model** | Subscription | Subscription | Subscription | Freemium | Freemium | **Open Source** ✅ |
| **Deployment** | Cloud | Cloud | Cloud | Cloud | Cloud | **On-Premises** ✅ |
| **Customization** | Limited | Limited | Very Limited | None | Limited | **Full** ✅ |
| **Data Control** | Provider | Provider | Provider | Provider | Provider | **Institution** ✅ |
| **Portfolio Focus** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | **⭐⭐⭐⭐⭐** ✅ |
| **Admin Controls** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐ | **⭐⭐⭐⭐⭐** ✅ |
| **Verification Workflow** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ | **⭐⭐⭐⭐⭐** ✅ |
| **Local Deployment** | ❌ | ❌ | ❌ | ❌ | ❌ | **✅** |
| **Ease of Setup** | Hard | Medium | Easy | Very Easy | Very Easy | **Easy** ✅ |
| **Learning Curve** | High | Medium | Low | Very Low | Very Low | **Low** ✅ |
| **Scalability** | High | High | Medium | Medium | High | **High** ✅ |
| **Security** | Good | Good | Good | Good | Good | **Excellent** ✅ |
| **Support Quality** | Professional | Professional | Good | Good | Self-service | **Community** ✅ |
| **Real-time Updates** | ✅ | ✅ | ✅ | ✅ | ✅ | **✅** |
| **Mobile Responsive** | ✅ | ✅ | ✅ | ✅ | ✅ | **✅** |
| **API Availability** | ✅ | ✅ | Limited | ❌ | ✅ | **✅** (REST) |
| **Institutional Fit** | Good | Good | Fair | Poor | Poor | **Excellent** ✅ |

---

## **2.3 Research Gap / Justification for Proposed Work**

### **Identified Research and Market Gaps**

#### **Gap 1: Institutional-Focused Design**
**Problem:** Existing systems are either generic LMS platforms (Blackboard, Canvas) or consumer-focused portfolio tools (Portfolium). None specifically address institutional achievement management workflows.

**SPAM Solution:** 
- Designed specifically for educational institutions
- Built-in institutional workflows (registration, verification, approval)
- Role-based separation of admin and student functionalities
- Institutional branding and customization

#### **Gap 2: Structured Verification & Approval Workflow**
**Problem:** Most systems lack a formal, multi-stage verification process. Achievement claims are not systematically validated.

**SPAM Solution:**
```
Student Submission → Admin Review → Approval/Rejection → Feedback → Portfolio Display
```
- Clear workflow visibility
- Detailed feedback mechanism
- Trackable status at each stage
- Audit trail of all decisions

#### **Gap 3: Cost Accessibility**
**Problem:** Enterprise solutions are prohibitively expensive (₹2,00,000+/year), limiting adoption to well-funded institutions.

**SPAM Solution:**
- Completely free using open-source technologies
- No licensing or subscription fees
- Minimal infrastructure cost (₹5,000-34,000/year)
- 80-90% cost reduction vs. commercial solutions

#### **Gap 4: Data Sovereignty**
**Problem:** Cloud-only solutions store institutional data on external servers, creating compliance and security concerns.

**SPAM Solution:**
- On-premises deployment option
- Full institutional data control
- No external data dependencies
- Compliance with institutional policies

#### **Gap 5: Customization Capabilities**
**Problem:** Proprietary solutions require expensive consulting for customization (if possible at all).

**SPAM Solution:**
- Open-source codebase
- Full customization possibilities
- Internal IT teams can modify
- Institutional branding easy to implement

#### **Gap 6: Entry Barrier for Resource-Constrained Institutions**
**Problem:** Resource-limited institutions (tier-2 and tier-3 colleges) cannot afford comprehensive portfolio systems.

**SPAM Solution:**
- Minimal infrastructure requirements
- Can run on existing institutional servers
- Minimal IT staff training required
- Scalable architecture

#### **Gap 7: Educational Value**
**Problem:** Commercial systems are "black box" - students don't understand underlying architecture.

**SPAM Solution:**
- Open-source educational tool
- CS students can study real-world codebase
- Opportunity for student contributions
- Learning through doing

### **Justification for SPAM Development**

**Why Build SPAM Instead of Using Existing Systems?**

1. **Financial Viability:** Save 80-90% in annual costs
2. **Institutional Control:** Keep data within institutional boundaries
3. **Customization Freedom:** Adapt to specific institutional needs
4. **Educational Integration:** Part of CS curriculum
5. **Sustainability:** No vendor lock-in or dependency
6. **Community:** Can be shared with other institutions
7. **Innovation:** Can add features tailored to Indian educational context

**Targeted Institutions:**
- Tier-2 and Tier-3 engineering colleges
- Departments with limited IT budgets
- Institutions seeking data sovereignty
- Colleges wanting to improve achievement tracking
- Departments supporting open-source initiatives

---

## **2.4 Summary of Literature Survey**

### **Key Findings:**

1. **Market Maturity:** Digital portfolio solutions exist but suffer from cost, cloud-dependency, and generic design limitations.

2. **Institutional Need:** Clear demand for affordable, flexible, locally-deployable achievement management systems.

3. **Technology Readiness:** All necessary technologies (MERN stack) are mature and production-ready.

4. **Competitive Advantage Opportunities:**
   - Cost leadership (free vs. ₹50,000-200,000/year)
   - Data sovereignty (on-premises vs. cloud)
   - Customization (open-source vs. proprietary)
   - Institutional fit (specialized vs. generic)

5. **Success Factors Identified:**
   - Strong authentication and security
   - Intuitive user interface
   - Reliable verification workflow
   - Comprehensive admin tools
   - Scalable architecture

### **Conclusion of Literature Survey**

**SPAM fills a critical gap in the educational technology market by providing:**
- ✅ An affordable solution for resource-constrained institutions
- ✅ Institutional control over data and customization
- ✅ Specialized achievement management and portfolio building focus
- ✅ Modern, secure, and scalable architecture
- ✅ Suitable educational value for CS students

**The development of SPAM is well-justified and addresses unmet market needs while maintaining superior specifications compared to existing systems.**

---

**Submitted By:**
- Kanishk Sharma (Roll No. 23EAJCS022)
- Harsh Tailor (Roll No. 23EAJCS018)

**Under the Guidance of:**
- Prof. Prakash Sharma

**Institution:**
- Aryabhatta College of Engineering
- Bikaner Technical University

