import mongoose from 'mongoose';
import Counter from './counterModel.js';
  
const verifySchema = mongoose.Schema({
  v_id : {
    type : Number, 
    unique : true, 
    immutable : true, 
  }, 
  s_id : {
    type : String, 
    required : true, 
    lowercase : true, 
    trim : true
  }, 
  category : {
    type : String, 
    required : true, 
    enum : ["skills","result","certificate","project","internship"]
  }, 
  body : {
    type : Object, 
    required : true
  }, 
  message : {
    type : String, 
    trim : true
  }, 
  proof : {
    type : String, 
    required : true, 
    trim : true
  }, 
  status : {
    type : String, 
    default : "pending", 
    enum : ["pending","accepted","rejected"]
  }, 
  feedback : {
    type : String, 
    trim : true
  }, 
  creation_date : {
    type : Date, 
    required : true, 
    default : Date.now()
  }
});

verifySchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate({ name : "autoInc" }, { $inc : { v_id : 1 } }, { new : true, upsert : true });
  
  this.v_id = counter.v_id;
  next();
  
  } catch (e) {
    next(e);
  }
});
  
const Verify = mongoose.model("Verify", verifySchema);
export default Verify;