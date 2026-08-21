import Logs from '../../model/logsModel.js';

export const getLogs = async(req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(401).json({ 
      success : false, 
      message : "Unauthorized" 
    });
    
    const response = await Logs.find();
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
    console.error("Logs fetch error:", error);
    return res.status(500).json({ 
      success : false, 
      message : "Server error",
      error : error.message 
    });
  }
};