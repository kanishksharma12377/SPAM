import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name : {
    type : String, 
    default : "autoInc", 
    unique : true, 
    immutable : true
  }, 
  n_id : { 
    type : Number, 
    required : true, 
    default : 0
  }, 
  v_id : { 
    type: Number, 
    required : true, 
    default : 0
  },
  l_id : {
    type : Number, 
    required : true, 
    default : 0
  }
});

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;