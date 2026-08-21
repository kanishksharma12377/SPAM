import Student from '../../model/studentModel.js';
import calculateAge from '../../utils/calculateAge.js';
import createLog from '../../utils/logs.js';
import zodValidator from '../../utils/zodValidator.js';
import recordSchema from '../../validator/student/editRecordSchema.js';

export const getRecordsList = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const response = await Student.find();
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find data"
    });
    
    return res.status(200).json({
      success : true, 
      count : response.length, 
      data  : response
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success : false, 
      message : "Server error", 
      error : error.message 
    });
  }
};

export const getRecord = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const s_id = req.params.s_id;
    const response = await Student.findOne({s_id});
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find data"
    });
    
    return res.status(200).json({
      success : true,
      data : response
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success : false, 
      message : "Server error", 
      error : error.message 
    });
  }
};

export const editRecord = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({ 
      success : false, 
      message : "Unauthorized" 
    });
    
    let data = zodValidator(recordSchema, req.body, res);
    if (!data) return;
    const s_id = req.params.s_id;
    if (Object.keys(data).length === 0) return res.status(400).json({
      success : false, 
      message : "Invalid input"
    });
    if (data.dob){
      data.age = calculateAge(data.dob);
    }
    
    const response = await Student.findOneAndUpdate({s_id},{$set : data},{new : true});
    if (!response) return res.status(404).json({
      success : false,
      message : "Can't find data"
    });
    
    createLog("teacher", s_id, "update",{ message : "Teacher edit student record", newData : data });
    
    return res.status(201).json({
      success : true, 
      message : "Record is updated", 
      updatedData : response
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success : false, 
      message : "Server error",
      error : error.message  
    });
  }
};