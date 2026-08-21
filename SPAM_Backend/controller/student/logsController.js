import Logs from '../../model/logsModel.js';

export const getLogs = async(req, res) => {
  try {
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
      success : false, 
      message : "Unauthorized"
    });
    
    const s_id = req.user.id;
    const response = await Logs.find({s_id});
    
    if (!response) return res.status(404).json({
      success : false, 
      message : "Can't find logs"
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
      message: "Server error", 
      error: error.message });
  }
};