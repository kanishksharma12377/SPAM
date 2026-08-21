import Verify from '../../model/verifyModel.js';
import createLog from '../../utils/logs.js';
import zodValidator from '../../utils/zodValidator.js';
import requestSchema from '../../validator/student/uploadSchema.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getRequests = async(req, res) => {
  try {
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const s_id = req.user.id;
    const response = await Verify.find({s_id});
    
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
      sucess : false, 
      message : "Server error",
      error : error.message 
    });
  }
};

export const uploadRequest = async(req, res) => {
  try {
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Proof document is required. Please upload an image or PDF file."
      });
    }
    
    // Parse body from JSON string (sent via FormData)
    let requestBody = req.body;
    if (typeof req.body.body === 'string') {
      try {
        requestBody = {
          ...req.body,
          body: JSON.parse(req.body.body)
        };
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid body format"
        });
      }
    }
    
    let data = zodValidator(requestSchema, requestBody, res);
    if (!data) return;
    
    const s_id = req.user.id;
    const creation_date = new Date();
    const proof = `/uploads/${req.file.filename}`; // Store relative path
    
    data = {...data, s_id, creation_date, proof };
    
    const response = await Verify.create(data);
    if (!response) return res.status(500).json({
      success : false, 
      message : "Can't upload request"
    });
    
    createLog("student", s_id, "request",{
      message : "Student upload a request",
      req : response 
    });
    
    return res.status(201).json({
      success : true,
      message : "upload request is created",
      newData : response
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      success : false, 
      message : "Server error", 
      error : error.message 
    });
  }
};

export const deleteRequest = async(req, res) => {
  try {
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const v_id = req.params.v_id;
    const s_id = req.user.id;
    
    const check = await Verify.findOne({v_id});
    if (check.s_id != s_id || check.status != "pending"  ) return res.status(403).json({
      success : false, 
      message : "You are not permitted to delete this request"
    });
    
    const response = await Verify.findOneAndDelete({v_id});
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find data"
    });
    
    createLog("student", s_id, "request",{
      message : "Student delete a upload request", 
      deletedRequest : response
    });
    
    return res.status(200).json({
      success : true, 
      message : "request is deleted"
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

export const getProof = async(req, res) => {
  try {
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
      success : false, 
      message : "Unauthorized" 
    });
    
    const v_id = req.params.v_id;
    const s_id = req.user.id;
    
    // Find the request and verify ownership
    const request = await Verify.findOne({v_id});
    if (!request) return res.status(404).json({
      success : false, 
      message : "Request not found"
    });
    
    // Only the student who created the request can view the proof
    if (request.s_id !== s_id) return res.status(403).json({
      success : false, 
      message : "You are not permitted to view this proof"
    });
    
    // Send the file
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