import mongoose from 'mongoose';

const studentSchema = mongoose.Schema({
  s_id : {
    type : String,
    required : true, 
    unique : true, 
    index : true, 
    lowercase : true, 
    trim : true
  }, 
  name :{
    firstName : {
      type : String, 
      required : true, 
      trim : true, 
      lowercase : true
    }, 
    middleName : {
      type : String, 
      trim : true, 
      lowercase : true
    }, 
    lastName : {
      type : String, 
      trim : true, 
      lowercase : true
    }
  }, 
  fatherName : {
    type : String, 
    trim : true, 
    lowercase : true
  }, 
  motherName : {
    type : String, 
    trim : true, 
    lowercase : true
  }, 
  dob : {
    type : Date, 
    required : true
  }, 
  age : {
    type : Number, 
    required : true
  }, 
  gender : {
    type : String, 
    required : true, 
    enum : ["male","female","other"]
  }, 
  category : {
    type : String, 
    enum : ["gen","obc","st","sc"]
  }, 
  image : {
    type : String, 
    default : "/defaultProfile.png", 
    trim : true, 
    match: /\.(jpg|jpeg|png|gif|webp)$/i
  }, 
  gmail : {
    type : String, 
    required : true, 
    unique : true, 
    lowercase : true, 
    trim : true, 
    match : /^[\w.-]+@gmail\.com$/
  }, 
  contact : {
    type : String, 
    required : true, 
    trim : true, 
    match: /^[0-9]{10}$/
  }, 
  address : {
    locality : {
      type : String, 
      lowercase : true
    }, 
    city : {
      type : String, 
      required : true, 
      lowercase : true
    }, 
    district : {
      type : String, 
      required : true, 
      lowercase : true
    }, 
    state : {
      type : String, 
      required : true, 
      lowercase : true
    }, 
    pincode : {
      type : String, 
      required : true, 
      match: /^[0-9]{6}$/
    }
  }, 
  class : {
    type : String, 
    required : true, 
    enum : ["1yr","2yr","3yr","4yr"]
  }, 
  branch : {
    type : String, 
    required : true, 
    enum : ["cs","ce","me","ee"]
  },  
  profile : {
    type : String, 
    trim : true, 
    lowercase : true, 
  }, 
  socialAccount : [{
    name : {
      type : String, 
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    link : {
      type : String, 
      required : true, 
      match : /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/
    }
  }, { _id: false } ],
  
  document : [{
    name : {
      type : String, 
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    doc_no : {
      type : String,
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    image : {
      type : String, 
      trim : true, 
      match: /\.(jpg|jpeg|png|gif|webp)$/i
    }
  }, { _id: false } ], 
  
  skills : [{
    v_id : {
      type : String, 
      required : true, 
      unique : true, 
      immutable : true, 
      lowercase : true, 
      trim : true
    }, 
    name : {
      type : String, 
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    topic : {
      type : [String], 
      trim : true, 
      lowercase : true
    }
  }, { _id: false } ], 
  
  result : [{
    v_id : {
      type : String, 
      required : true, 
      unique : true, 
      immutable : true, 
      lowercase : true, 
      trim : true
    }, 
    name : {
      type : String, 
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    r_no : {
      type : String,
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    score : {
      type : String, 
      required : true, 
      trim : true, 
      lowercase : true
    }, 
    image : {
      type : String, 
      trim : true, 
      match: /\.(jpg|jpeg|png|gif|webp)$/i
    }
  }, { _id: false } ],
  
  certificate : [{
    v_id : {
      type : String, 
      required : true, 
      unique : true, 
      immutable : true, 
      lowercase : true, 
      trim : true
    }, 
    name : {
      type : String, 
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    c_id : {
      type : String,
      lowercase : true, 
      trim : true
    }, 
    image : {
      type : String, 
      trim : true, 
      match: /\.(jpg|jpeg|png|gif|webp)$/i
    }
  }, { _id: false } ],
  
  project : [{
    v_id : {
      type : String, 
      required : true, 
      unique : true, 
      immutable : true, 
      lowercase : true, 
      trim : true
    }, 
    name : {
      type : String, 
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    description : {
      type : String
    }, 
    technology : {
      type : [String], 
      trim : true, 
      lowercase : true
    }, 
    image : {
      type : String, 
      trim : true, 
      match: /\.(jpg|jpeg|png|gif|webp)$/i
    }, 
    link : {
      type : String, 
      match : /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/
    }
  }, { _id: false } ],
  
  internship : [{
    v_id : {
      type : String, 
      required : true, 
      unique : true, 
      immutable : true, 
      lowercase : true, 
      trim : true
    }, 
    company : {
      type : String, 
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    field : {
      type : String,
      required : true, 
      lowercase : true, 
      trim : true
    }, 
    duration : {
      type : Number, 
      required : true
    }, 
    certificate_image : {
      type : String, 
      trim : true, 
      match : /\.(jpg|jpeg|png|gif|webp)$/i
    }
  }, { _id: false } ]
});

const Student = mongoose.model("Student", studentSchema);
export default Student;