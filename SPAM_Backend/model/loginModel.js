import mongoose from 'mongoose';

const loginSchema = mongoose.Schema({
  s_id : {
    type : String,
    required : true, 
    unique : true, 
    index : true, 
    lowercase : true, 
    trim : true
  }, 
  name : {
    type : String, 
    required : true, 
    lowercase : true, 
    trim : true
  }, 
  username : {
    type : String, 
    required : true, 
    unique : true, 
    lowercase : true, 
    trim : true
  }, 
  password : {
    type : String, 
    required : true, 
    unique : true, 
    trim : true
  }, 
  role: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        const validYears = ["1yr", "2yr", "3yr", "4yr"];
        const validBranches = ["cs", "ce", "me", "ee"];
        const validSkills = ["skilled", "none"];
        
        if (arr.length !== 5) return false;
        if (arr[0] !== "student") return false;
        if (arr[1] !== String(this.s_id)) return false;
        if (!validYears.includes(arr[2])) return false;
        if (!validBranches.includes(arr[3])) return false;
        if (!validSkills.includes(arr[4])) return false;

        return true;
      }
    }
  }
});

const Login = mongoose.model("Login", loginSchema);
export default Login;