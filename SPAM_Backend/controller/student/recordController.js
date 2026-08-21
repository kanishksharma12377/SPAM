import Student from '../../model/studentModel.js';
import calculateAge from '../../utils/calculateAge.js';
import createLog from '../../utils/logs.js';
import zodValidator from '../../utils/zodValidator.js';
import setupSchema from '../../validator/student/setupSchema.js';
import recordSchema from '../../validator/student/editRecordSchema.js';
import jwt from 'jsonwebtoken';

export const getRecord = async(req, res) => {
  try {
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const s_id = req.user.id;
    const response = await Student.findOne({s_id});
    
    if (!response) return res.status(404).json({
      success :false,
      message:"can't find data"
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
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const s_id = req.user.id;
    
    // Parse FormData - convert JSON strings back to objects
    let data = { ...req.body };
    if (data.name && typeof data.name === 'string') {
      try {
        data.name = JSON.parse(data.name);
      } catch (e) {
        console.error('Error parsing name:', e);
      }
    }
    if (data.address && typeof data.address === 'string') {
      try {
        data.address = JSON.parse(data.address);
      } catch (e) {
        console.error('Error parsing address:', e);
      }
    }
    if (data.socialAccount && typeof data.socialAccount === 'string') {
      try {
        data.socialAccount = JSON.parse(data.socialAccount);
      } catch (e) {
        console.error('Error parsing socialAccount:', e);
      }
    }
    if (data.document && typeof data.document === 'string') {
      try {
        data.document = JSON.parse(data.document);
      } catch (e) {
        console.error('Error parsing document:', e);
      }
    }
    
    data = zodValidator(recordSchema, data, res);
    
    if (!data) return;
    if (!data || Object.keys(data).length === 0) {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ 
          success : false, 
          message : "Invalid input"
        });
      }
    }
    
    if (data.dob){
      data.age = calculateAge(data.dob);
    }
    
    // Handle image upload
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    
    const response = await Student.findOneAndUpdate({s_id},{$set : data},{new : true});
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find data"
    });
    
    createLog("student", s_id, "update",{
      message : "Student edit his record",
      newData : data 
    });
    
    return res.status(201).json({
      success : true, 
      message : "record is updated", 
      updatedData : response
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success :false,
      message : "Server error", 
      error : error.message 
    });
  }
};

export const setupRecord = async(req, res) => {
  try {
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    if (req.user.setup === true) return res.status(403).json({
      success : false, 
      message : "Account already setup"
    });
    
    const s_id = req.user.id;
    
    // Check if student record already exists
    const existingRecord = await Student.findOne({s_id});
    if (existingRecord) {
      return res.status(400).json({
        success : false, 
        message : "Profile already exists. Please contact admin if you need to update your information."
      });
    }
    
    // Parse FormData - convert JSON strings back to objects
    let data = { ...req.body };
    if (data.name && typeof data.name === 'string') {
      try {
        data.name = JSON.parse(data.name);
      } catch (e) {
        console.error('Error parsing name:', e);
      }
    }
    if (data.address && typeof data.address === 'string') {
      try {
        data.address = JSON.parse(data.address);
      } catch (e) {
        console.error('Error parsing address:', e);
      }
    }
    if (data.socialAccount && typeof data.socialAccount === 'string') {
      try {
        data.socialAccount = JSON.parse(data.socialAccount);
      } catch (e) {
        console.error('Error parsing socialAccount:', e);
      }
    }
    if (data.document && typeof data.document === 'string') {
      try {
        data.document = JSON.parse(data.document);
      } catch (e) {
        console.error('Error parsing document:', e);
      }
    }
    
    data = zodValidator(setupSchema, data, res);
    
    if (!data) return;
    data.age = calculateAge(data.dob);
    
    // Handle image upload
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    
    data = {...data, s_id};
    
    const response = await Student.create(data);
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't setup account"
    });
    
    const newPayload = {
      id : s_id,
      name : req.user.name,
      role : req.user.role,
      setup : true, 
    };
    
    const newToken = jwt.sign(newPayload, process.env.JWT_SECRET, {
      expiresIn : "15d",
    });
    
    res.cookie("authToken", newToken, {
      httpOnly : true,
      sameSite : "Strict",
      maxAge : 15 * 24 * 60 * 60 * 1000,
    });
    
    createLog("student", s_id, "setup",{
      message : "Student setup his record",
      data 
    });
    
    return res.status(201).json({
      success : true, 
      message : "Account setup successfully",
      user : newPayload, 
      newData : response
    });
    
  } catch (error) {
    console.error(error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        success : false, 
        message : "Profile already exists for this student ID. Please contact admin."
      });
    }
    
    res.status(500).json({ 
      success : false, 
      message : "Server error", 
      error : error.message 
    });
  }
};