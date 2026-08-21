import Verify from '../../model/verifyModel.js';
import Student from '../../model/studentModel.js';

import createLog from '../../utils/logs.js';
import zodValidator from '../../utils/zodValidator.js';
import verifySchema from '../../validator/admin/verifyRequestSchema.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getRequests = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const response = await Verify.find();
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

export const verifyRequest = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({ 
      success : false, 
      message : "Unauthorized" 
    });
    
    let data = zodValidator(verifySchema, req.body, res);
    if (!data) return;
    const v_id = req.params.v_id;
    
    const response = await Verify.findOneAndUpdate({v_id}, {$set : data},{ new : true});
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find data"
    });
    const category = response.category;
    const body = response.body;
    const upload = {
      v_id, 
      ...body
    }
    
    if (data.status === "accepted") {
      const record = await Student.findOneAndUpdate({s_id:response.s_id}, { $push : { [category] : upload }},{ new : true});
    } else {
      const record = await Student.findOneAndUpdate({s_id: response.s_id}, {$pull : { [category] : {v_id}}},{new : true})
    }
    
    createLog("teacher", response.s_id, "request",{ 
      message : `Teacher ${data.status} student's request`,
      request : response
    })
    
    return res.status(201).json({
      success : true, 
      message : "Upload request is verified", 
      newData : response
    });
    
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ 
      success : false, 
      message : "Server error",
      error : error.message 
    });
  }
};

export const getProof = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const v_id = req.params.v_id;
    
    // Find the request
    const request = await Verify.findOne({v_id});
    if (!request) return res.status(404).json({
      success : false, 
      message : "Request not found"
    });
    
    // Admin can view any proof
    const filePath = path.join(__dirname, '../../public', request.proof);
    return res.sendFile(filePath);
    
  } catch (error) {
    console.error("Get proof error:", error);
    return res.status(500).json({ 
      success : false, 
      message : "Server error", 
      error : error.message 
    });
  }
};