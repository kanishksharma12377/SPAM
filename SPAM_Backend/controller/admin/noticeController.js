import Notice from '../../model/noticeModel.js';
import createLog from '../../utils/logs.js';
import zodValidator from '../../utils/zodValidator.js';
import createNoticeSchema from '../../validator/admin/createNoticeSchema.js';

export const getNotices = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({ 
      success : false, 
      message : "Unauthorized"
    });
    
    const response = await Notice.find();
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

export const createNotice = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({ 
      success : false, 
      message : "Unauthorized" 
    });
    
    let data = zodValidator(createNoticeSchema, req.body, res);
    if (!data) return;
    
    const issue_date = new Date();
    data = {...data, issue_date};
    
    const response = await Notice.create(data);
    if (!response) return res.status(400).json({
      success : false, 
      message : "Can't create notice"
    });
    
    createLog("teacher", null, "notice",{
      message : "Teacher creates a new notice",
      data : response
    });
    
    return res.status(201).json({
      success : true, 
      message : "Notice is created", 
      newData : response
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

export const deleteNotice = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({ 
      success : false, 
      message : "Unauthorized" 
    });
    
    const n_id = req.params.n_id;
    const response = await Notice.findOneAndDelete({n_id});
    if (!response) return res.status(400).json({
      success : false, 
      message : "Can't find data"
    });
    
    createLog("teacher", null, "notice",{
      message : "Teacher deleted a notice",
      data : response
    });
    
    return res.status(200).json({
      success : true, 
      message : "Notice is deleted"
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