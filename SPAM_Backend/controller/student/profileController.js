import Login from '../../model/loginModel.js';
import Student from '../../model/studentModel.js';
import argon2 from 'argon2';

import createLog from '../../utils/logs.js';
import zodValidator from '../../utils/zodValidator.js';
import editProfileSchema from '../../validator/student/editProfileSchema.js';

export const getProfile = async(req, res) => {
  console.log('=== GET PROFILE CALLED ===');
  console.log('req.user:', req.user);
  console.log('req.cookies:', req.cookies);
  
  try {
    if (!req.user) {
      console.log('No req.user found - auth middleware issue');
      return res.status(401).json({
        success : false, 
        message : "Unauthorized - No user session found"
      });
    }
    
    if (req.user.role[0] !== "student") {
      console.log('Not a student - role:', req.user.role);
      return res.status(401).json({
        success : false, 
        message : "Unauthorized - Not a student"
      });
    }
    
    const s_id = req.user.id;
    console.log('Fetching profile for s_id:', s_id);
    
    // Get student data from Student model (this has all the profile information)
    const studentData = await Student.findOne({s_id},{_id : 0}).lean();
    console.log('Student data found:', !!studentData);
    
    if (studentData) {
      console.log('Student data keys:', Object.keys(studentData));
    }
    
    if (!studentData) {
      // If no student data, return basic info from req.user
      console.log('No student data, returning basic info from token');
      const fallbackData = {
        s_id: s_id,
        name: req.user.name || 'Student',
        role: req.user.role,
        class: req.user.role[2],
        branch: req.user.role[3],
        username: req.user.username || s_id
      };
      console.log('Returning fallback data:', fallbackData);
      return res.status(200).json({
        success : true, 
        data : fallbackData
      });
    }
    
    console.log('Returning full student data');
    
    return res.status(200).json({
      success : true, 
      data : studentData
    });
    
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ 
      success : false, 
      message : "Server error",
      error : error.message 
    });
  }
};

export const editProfile = async(req, res) => {
  try {
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
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
      data.password = await argon2.hash(data.password);
    }
    
    const response = await Login.findOneAndUpdate({s_id : req.user.id},{$set : data},{ new : true});
    
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find data"
    });
    
    createLog("student", req.user.id, "update",{ 
      message : "Student edit her profile", 
      newData : data 
    });
    
    return res.status(201).json({
      success : true, 
      message : "profile is updated"
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