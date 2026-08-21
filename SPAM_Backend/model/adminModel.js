import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
  a_id : {
    type : String, 
    required : true, 
    unique : true, 
    immutable : true, 
    lowercase : true, 
    trim : true
  }, 
  name : {
    type : String, 
    lowercase : true, 
    trim : true
  }, 
  contact : {
    type : String, 
    trim : true, 
    match: /^[0-9]{10}$/
  }, 
  gmail : {
    type : String, 
    unique : true, 
    lowercase : true, 
    trim : true, 
    match : /^[\w.-]+@gmail\.com$/
  }, 
  image : {
    type : String, 
    default : "/defaultProfile.png", 
    trim : true, 
    match: /\.(jpg|jpeg|png|gif|webp)$/i
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
    trim : true, 
  }, 
  role : {
    type : String, 
    enum : ["admin"], 
    default : "admin", 
    immutable : true
  }
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;