import Admin from '../../model/adminModel.js';
import argon2 from 'argon2';

import createLog from '../../utils/logs.js';
import zodValidator from '../../utils/zodValidator.js';
import editProfileSchema from '../../validator/admin/editProfileSchema.js';

export const getProfile = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({ 
      success : false, 
      message : "Unauthorized" 
    });
    
    const response = await Admin.findOne({a_id : req.user.id},{_id : 0,password : 0});
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

export const editProfile = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({ 
      success : false, 
      message : "Unauthorized" 
    });
    
    let data = zodValidator(editProfileSchema, req.body, res);
    if (!data) return;
    
    if (Object.keys(data).length === 0) return res.status(400).json({ 
      success : false, 
      message : "Invalid input" 
    });
    if (data.password) {
      data.password = await argon2.hash(data.password)
    }
    
    const response = await Admin.findOneAndUpdate({a_id : req.user.id},{$set : data},{ new : true});
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find data"
    });
    
    createLog("teacher", null, "update",{ message : "Teacher edit his profile", newData : data });
    
    return res.status(201).json({
      success : true, 
      message : "Profile is updated", 
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