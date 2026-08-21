import mongoose from 'mongoose';
import Counter from './counterModel.js';

const noticeSchema = mongoose.Schema({
  n_id : {
    type : Number, 
    unique : true, 
    immutable : true, 
  }, 
  category : {
    type : String, 
    required : true, 
    enum : ["general","exam","project","internship","job","event","update"]
  }, 
  for : {
    type : [], 
    required : true, 
    default : ["student"]
  }, 
  subject : {
    type : String, 
    required : true
  }, 
  body : {
    type : String, 
    required : true
  }, 
  issue_date : {
    type : Date, 
    default : Date.now()
  }, 
  expire_date : {
    type : Date
  }
});

noticeSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate({ name : "autoInc" }, { $inc : { n_id : 1 } }, { new : true, upsert : true });
  
  this.n_id = counter.n_id;
  next();
  
  } catch (e) {
    next(e);
  }
});

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;