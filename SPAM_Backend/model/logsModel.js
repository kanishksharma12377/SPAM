import mongoose from 'mongoose';
import Counter from './counterModel.js';

const logsSchema = mongoose.Schema({
  l_id: {
    type : Number, 
    unique : true, 
    immutable : true, 
  }, 
  by : {
    type : String, 
    required : true, 
    enum : ["teacher","student"]
  }, 
  s_id : {
    type : String, 
    default : null, 
    lowercase : true, 
    trim : true
  }, 
  type : {
    type : String, 
    required : true, 
    enum : ["register","unregister","request","update","notice","setup"]
  }, 
  time : {
    type : Date, 
    default : Date.now()
  }, 
  detail : {
    type : Object, 
    default : {}
  }
});

logsSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  try {
    const counter = await Counter.findOneAndUpdate({ name : "autoInc" }, { $inc : { l_id : 1 } }, { new : true, upsert : true });
  
  this.l_id = counter.l_id;
  next();
  
  } catch (e) {
    next(e);
  }
});;

const Logs = mongoose.model("Logs", logsSchema);
export default Logs;