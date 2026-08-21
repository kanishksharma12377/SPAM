import Login from '../../model/loginModel.js';
import Student from '../../model/studentModel.js';
import Verify from '../../model/verifyModel.js';

import createLog from '../../utils/logs.js';
import zodValidator from '../../utils/zodValidator.js';

import registerSchema from '../../validator/admin/registerStudentSchema.js';
import editStuCredSchema from '../../validator/admin/editStudentCredentialSchema.js';

import argon2 from 'argon2';

export const getRegisteredStudents = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({ 
      success : false, 
      message : "Unauthorized" 
    });
    
    const response = await Login.find({},{_id : 0,password : 0});
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find data"
    });
    return res.status(200).json({
      success : true,
      count : response.length, 
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

export const registerStudent = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({
      success : false,
      message : "Unauthorized" 
    });
    
    let data = zodValidator(registerSchema, req.body, res);
    if (!data) return;
    
    let {s_id, name, username, password, role1, role2, role3} = data;
    password = await argon2.hash(password)
    const role = ["student", s_id, role1, role2, role3];
    const body = {s_id, name, username, password, role};
    
    const response = await Login.create(body);
    if (!response) return res.status(400).json({
      success : false, 
      message : "Can't register student"
    });
    
    createLog("teacher", s_id, "register",{
      message : "Teacher register a student",
      data : {s_id, name, username, password,role}
    });
    
    return res.status(201).json({
      success : true, 
      message : "Student registered successfully"
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

export const editStudentCredential = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    let data = zodValidator(editStuCredSchema, req.body, res);
    if (!data) return;
    const s_id = req.params.s_id;
    if (Object.keys(data).length === 0) return res.status(400).json({ 
      success : false, 
      message : "Invalid input" 
    });
    
    const student = await Login.findOne({ s_id });
    if (!student) return res.status(404).json({
      success : false, 
      message : "Student not found"
    });
    
    if (data.password) {
      data.password = await argon2.hash(data.password);
    }
    
    const oldRole = student.role;
    if ("role1" in data || "role2" in data || "role3" in data || "s_id" in data) {
      const newS_id = data.s_id || oldRole[1];
      const newRole1 = data.role1 || oldRole[2];
      const newRole2 = data.role2 || oldRole[3];
      const newRole3 = data.role3 || oldRole[4];

      data.role = ["student", newS_id, newRole1, newRole2, newRole3];
    }
    
    delete data.role1;
    delete data.role2;
    delete data.role3;

    const response = await Login.findOneAndUpdate({s_id},{$set : data},{ new : true});
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't update data"
    });
    
    if (data.s_id) {
      const studentUpdate = await Student.findOneAndUpdate({ s_id }, { $set : { s_id : data.s_id } });
    }
    
    createLog("teacher", s_id, "update",{
      message : "Teacher update student credentials/account",
      newData : data 
    });
    
    return res.status(201).json({
      success : true,
      message : "Profile is updated"
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

export const unregisterStudent = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const s_id = req.params.s_id;
    const response = await Login.findOneAndDelete({s_id});
    
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find data"
    });
    const stu = await Student.findOneAndDelete({s_id});
    const request = await Verify.findOneAndDelete({s_id});
    
    createLog("teacher", s_id, "unregister",{
      message : "Teacher unregistered a student",
      data : { 
        account : response, 
        record : stu, 
        requests : request
      }
    });
    
    return res.status(200).json({
      success : true,
      message : "Student is unregistered"
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