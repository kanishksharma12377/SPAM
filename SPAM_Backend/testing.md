# Admin
- login
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "admin", 
    "username" : "teacher", 
    "password" : "Admin@123"
}

- get profile
    url = http://localhost:3000/api/admin/profile
    method = get

- edit profile  
    url = http://localhost:3000/api/admin/profile/scs0002
    method = post
body = {
    "name" : "prakash sharma", 
    "contact" : "9876543210", 
    "gmail" : "example@gmail.com", 
    "username" : "admin"
}

- get profile
    url = http://localhost:3000/api/admin/profile
    method = get

- register student x3 (1yr, 2yr, 4yr)
    url = http://localhost:3000/api/admin/register/new
    method = post
body1 = {
    "s_id" : "scs0001", 
    "name" : "harsh", 
    "username" : "harsh", 
    "password" : "Harsh@1234", 
    "role1" : "1yr", 
    "role2" : "cs", 
    "role3" : "none"
}
body2 = {
    "s_id" : "sme0001", 
    "name" : "kanishk", 
    "username" : "kanishk", 
    "password" : "Kanishk@123", 
    "role1" : "2yr", 
    "role2" : "me", 
    "role3" : "skilled"
}
body3 = {
    "s_id" : "scs0002", 
    "name" : "dev", 
    "username" : "devdutt", 
    "password" : "Devdutt@123", 
    "role1" : "1yr", 
    "role2" : "cs", 
    "role3" : "none"
}

- get register student
  ** 3 account **
    url = http://localhost:3000/api/admin/register
    method = get

- edit student credentials
    url = http://localhost:3000/api/admin/register/
    method = patch
body = {
    "name" : "devdutt", 
    "password" : "Devd@123", 
    "role1" : "4yr"
}

- get register student
  ** 3 account **
    url = http://localhost:3000/api/admin/register
    method = get

- get record list
  ** 0 record **
    url = http://localhost:3000/api/admin/record
    method = get

- get logs 
  ** 5 logs **
    url = http://localhost:3000/api/admin/logs
    method = get

- logout
    url = http://localhost:3000/api/logout
    method = post


# Student 1
- wrong login
  ** error **
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "student", 
    "username" : "harsh", 
    "password" : "harsh@123"
}

- login
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "student", 
    "username" : "harsh", 
    "password" : "Harsh@1234"
}

- get profile
  ** error **
    url = http://localhost:3000/api/profile
    method = get

- setup
    url = http://localhost:3000/api/record/setup
    method = post
body = {
  "name": {
    "firstName": "harsh",
    "lastName": "tailor"
  },
  "dob": "2003-09-21",
  "gender": "male",
  "category": "gen",
  "image": "profilepic.jpg",
  "gmail": "harsh@gmail.com",
  "contact": "9876543210",
  "address": {
    "locality": "green park",
    "city": "jaipur",
    "district": "jaipur",
    "state": "rajasthan",
    "pincode": "302015"
  },
  "class": "1yr",
  "branch": "cs",
  "socialAccount": [
    {
      "name": "linkedin",
      "link": "https://www.linkedin.com"
    }
  ],
  "profile": "mern developer",
  "document": [
    {
      "name": "aadhar card",
      "doc_no": "1234-5678-9012",
      "image": "aadhar.jpg"
    },
    {
      "name": "pan card",
      "doc_no": "abcde1234f"
    }
  ]
}

- get profile
    url = http://localhost:3000/api/profile
    method = get

- edit profile
    url = http://localhost:3000/api/profile
    method = patch
body = {
    "name" : "harsh tailor",
    "password" : "Harsh@123"
}

- get record
    url = http://localhost:3000/api/record
    method = get

- edit record
    url = http://localhost:3000/api/record
    method = patch
body = {
  "fatherName": "rajesh tailor",
  "category": "obc",
  "address": {
    "city": "masuda",
    "district": "beawar",
    "state": "rajasthan",
    "pincode": "304360"
  },
  "socialAccount": [
    {
      "name": "linkedin",
      "link": "https://www.linkedin.com"
    },
    {
      "name": "github",
      "link": "https://github.com/harsh"
    }
  ]
}

- get record
    url = http://localhost:3000/api/record
    method = get

- upload request x3
    url = http://localhost:3000/api/upload
    method = post
body1 = {
  "category": "skills",
  "message": "Updated skillset for profile",
  "body": {
    "name": "web development",
    "topics": ["html", "css", "js", "react"]
  }
}
body2 = {
  "category": "result",
  "message": "Semester result uploaded",
  "body": {
    "name": "semester 1 result",
    "r_no": "cs20210123",
    "score": 87,
    "image": "result_sem4.png"
  }
}
body3 = {
  "category": "project",
  "message": "Final year project details",
  "body": {
    "name": "smart attendance",
    "description": "a face recognition based attendance system built using machine learning and web technologies.",
    "technology": ["python", "opencv", "react", "nodejs"],
    "image": "project_smart_attendance.jpg",
    "url": "https://github.com/user/smart-attendance"
  }
}

- get request
  ** 3 request **
    url = http://localhost:3000/api/upload
    method = get

- delete request
    url = http://localhost:3000/api/upload/2
    method = delete

- get request
  ** 2 request **
    url = http://localhost:3000/api/upload
    method = get

- get notice
  ** 0 notice **
    url = http://localhost:3000/api/notice
    method = get

- get logs
  ** 8 logs **
    url = http://localhost:3000/api/logs
    method = get

- logout
    url = http://localhost:3000/api/logout
    method = post


# Student 2

- login
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "student", 
    "username" : "kanishk", 
    "password" : "Kanishk@123"
}

- setup
    url = http://localhost:3000/api/record/setup
    method = post
body = {
  "name": {
    "firstName": "kanishk",
    "lastName": "sharma"
  },
  "fatherName": "harsh tailor",
  "dob": "2005-12-29",
  "gender": "male",
  "category": "gen",
  "image": "profilepic.jpg",
  "gmail": "kanishk@gmail.com",
  "contact": "9876543210",
  "address": {
    "locality": "green park",
    "city": "jaipur",
    "district": "jaipur",
    "state": "rajasthan",
    "pincode": "302015"
  },
  "class": "2yr",
  "branch": "me",
  "socialAccount": [
    {
      "name": "linkedin",
      "link": "https://www.linkedin.com/in/kanishksharma"
    },
    {
      "name": "github",
      "link": "https://github.com/kanishksharma"
    }
  ],
  "profile": "cyber security"
}

- upload request
    url = http://localhost:3000/api/upload
    method = post
body1 = {
  "category": "internship",
  "message": "Completed internship during summer break",
  "body": {
    "field": "web development",
    "company": "techsoft solutions",
    "duration": 3,
    "certificate": "internship_certificate.webp"
  }
}
body2 = {
  "category": "certificate",
  "message": "Completed certified course successfully",
  "body": {
    "name": "gfg networking workshop",
    "c_id": "fsd2024",
    "image": "certificate_fsd.webp"
  }
}

- get logs
  ** 4 logs **
    url = http://localhost:3000/api/logs
    method = get

- logout
    url = http://localhost:3000/api/logout
    method = post


# Student 3
- login
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "student", 
    "username" : "devdutt", 
    "password" : "Devd@123"
}

- setup
    url = http://localhost:3000/api/record/setup
    method = post
body = {
  "name": {
    "firstName": "devdutt",
    "lastName": "pandey"
  },

  "dob": "2003-12-24",
  "gender": "male",
  "category": "gen",
  "gmail": "dev123@gmail.com",
  "contact": "9876543210",
  "address": {
    "locality": "green park",
    "city": "jaipur",
    "district": "jaipur",
    "state": "rajasthan",
    "pincode": "302015"
  },
  "class": "4yr",
  "branch": "cs",
  "socialAccount": [
    {
      "name": "linkedin",
      "link": "https://www.linkedin.com/in/rahulsharma"
    }
  ],
  "profile": "data analyst"
}

- upload request
    url = http://localhost:3000/api/upload
    method = post
body = {
  "category": "internship",
  "message": "Completed internship during summer break",
  "body": {
    "field": "ai/ml",
    "company": "techsoft solutions",
    "duration": 6,
    "certificate": "internship_certificate.webp"
  }
}

- get logs
  ** 4 logs **
    url = http://localhost:3000/api/logs
    method = get

- logout
    url = http://localhost:3000/api/logout
    method = post


# Admin
- login
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "admin", 
    "username" : "admin", 
    "password" : "Admin@123"
}

- get record list
  ** 3 record **
    url = http://localhost:3000/api/admin/record
    method = get

- edit record
    url = http://localhost:3000/api/admin/record/scs0002
    method = patch
body = {
  "socialAccount": [
    {
      "name": "linkedin",
      "link": "https://www.linkedin.com/in/rahulsharma"
    },
    {
      "name": "facebook",
      "link": "https://www.fb.com"
    }
  ],
  "document": [
    {
      "name": "aadhar card",
      "doc_no": "1234-5678-9012",
      "image": "aadhar.jpg"
    },
    {
      "name": "pan card",
      "doc_no": "abcde1234f"
    }
  ]
}

- get record
    url = http://localhost:3000/api/admin/record/scs0002
    method = get

- create notice x5 (student ,s1 only, 2yr)
    url = http://localhost:3000/api/admin/notice
    method = post
body1 = {
  "category": "general",
  "for": ["student"],
  "subject": "Campus Cleanliness Drive",
  "body": "All students are requested to participate in the campus cleanliness activity this weekend.",
  "expire_date": "2025-12-15"
}
** error ** body2 = {
  "category": "event",
  "for": ["student"],
  "subject": "Annual Sports Meet Registration",
  "body": "Registrations for the annual sports meet are now open. Interested students should register before the deadline.",
  "expire_date": "2025-11-02"
}
body3 = {
  "category": "event",
  "for": ["student"],
  "subject": "Annual Sports Meet Registration",
  "body": "Registrations for the annual sports meet are now open. Interested students should register before the deadline.",
  "expire_date": "2025-12-20"
}
body4 = {
  "category": "update",
  "for": ["scs0001"],
  "subject": "Profile Verification Required",
  "body": "Your student profile requires verification. Please update your missing details at the earliest.",
  "expire_date": "2025-12-18"
}
body5 ={
  "category": "internship",
  "for": [
    ["2yr"],
    ["cs", "ee","me","ee"],
    "none"
  ],
  "subject": "Summer Internship Opportunity",
  "body": "Students from 2nd year CS and EE who are marked as skilled can apply for the new summer internship program.",
  "expire_date": "2025-12-30"
}
body6 = {
  "category": "job",
  "for": [
    ["1yr", "2yr", "3yr", "4yr"],
    ["cs", "me", "ce", "ee"],
    "skilled"
  ],
  "subject": "Placement Preparation Bootcamp",
  "body": "A special bootcamp for skilled students across all years and branches. The program will focus on interview preparation, resume building, and coding challenges.",
  "expire_date": "2026-01-10"
}

- get notice
  ** 5 notice **
    url = http://localhost:3000/api/admin/notice
    method = get

- delete notice
    url = http://localhost:3000/api/admin/notice/2
    method = delete

- get notice
  ** 4 notice **
    url = http://localhost:3000/api/admin/notice
    method = get

- get request
  ** 5 request **
    url = http://localhost:3000/api/admin/upload
    method = get

- verify request (
  s1 : accept 2, reject 0 ,
  s2 : accept 1, reject 1
)
method = patch
url1 = http://localhost:3000/api/admin/upload/1
body1 = {
    "status" : "accepted"
}
url2 = http://localhost:3000/api/admin/upload/3
body2 = {
    "status" : "accepted"
}
url3 = http://localhost:3000/api/admin/upload/4
body3 = {
    "status" : "rejected", 
    "feedback" : "maja nhi aaya!!!"
}
url4 = http://localhost:3000/api/admin/upload/5
body4 = {
    "status" : "accepted"
}

- unregister student
    url = http://localhost:3000/api/admin/register/scs0002
    method = delete

- get request
  ** 4 request  **
    url = http://localhost:3000/api/admin/upload
    method = get

- get record list
  ** 2 record **
    url = http://localhost:3000/api/admin/record
    method = get

- get register student
  ** 2 account **
    url = http://localhost:3000/api/admin/register
    method = get

- get logs
  ** 29 logs **
    url = http://localhost:3000/api/admin/logs
    method = get

- logout
    url = http://localhost:3000/api/logout
    method = post


# Student 3
- login
  ** error **
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "student", 
    "username" : "dev", 
    "password" : "Dev@123"
}


# Student 1
- login
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "student", 
    "username" : "harsh", 
    "password" : "Harsh@123"
}

- get request
  ** 2 request **
    url = http://localhost:3000/api/upload
    method = get

- get record
 ** req data add to record **
    url = http://localhost:3000/api/record
    method = get

- delete request
  ** error **
    url = http://localhost:3000/api/upload/1
    method = delete

- get notice
  ** 2 notice **
    url = http://localhost:3000/api/notice
    method = get

- get logs
  ** 10 logs **
    url = http://localhost:3000/api/logs
    method = get

- logout
    url = http://localhost:3000/api/logout
    method = post


# Student 2
- login
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "student", 
    "username" : "kanishk", 
    "password" : "Kanishk@123"
}

- get request
  ** 2 request **
    url = http://localhost:3000/api/upload
    method = get

- get record
 ** req data add to record **
    url = http://localhost:3000/api/record
    method = get

- get notice
  ** 3 notice **
    url = http://localhost:3000/api/notice
    method = get

- get logs
  ** 6 logs **
    url = http://localhost:3000/api/logs
    method = get

- logout
    url = http://localhost:3000/api/logout
    method = post


# Admin
- login
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "admin", 
    "username" : "admin", 
    "password" : "Admin@123"
}

- get request
  ** 4 request **
    url = http://localhost:3000/api/admin/upload
    method = get

- verify request (reject s1 accepted request)
    url = http://localhost:3000/api/admin/upload/1
    method = patch
body = {
    "status" : "rejected", 
    "feedback" : "maja nhi aaya!!!"
}

- get logs
  ** 30 logs **
    url = http://localhost:3000/api/admin/logs
    method = get

- logout
    url = http://localhost:3000/api/logout
    method = post


# Student 1
- login
    url = http://localhost:3000/api/login
    method = post
body = {
    "role" : "student", 
    "username" : "harsh", 
    "password" : "Harsh@123"
}

- get request
  ** 2 request **
    url = http://localhost:3000/api/upload
    method = get

- get record
  ** skills removed **
    url = http://localhost:3000/api/record
    method = get

- get logs
  ** 11 logs **
    url = http://localhost:3000/api/logs
    method = get

- logout
    url = http://localhost:3000/api/logout
    method = post

_admins_    = 1 record
_students_  = 2 record
_logins_    = 2 record
_notices_   = 4 record
_verifies_  = 4 record
_logs_      = 30 record