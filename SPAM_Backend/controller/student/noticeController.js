import Notice from '../../model/noticeModel.js';

export const getNotices = async(req, res) => {
  try {
    if (!req.user || req.user.role[0] !== "student") return res.status(401).json({
      success : false, 
      message : "Unauthorized"
    });

    const [roleType, s_id, year, branch, skill] = req.user.role;
    
    const skillMatch = skill === "skilled" ? ["skilled", "none"] : ["none"];

    const today = new Date();

    const notices = await Notice.find({
      expire_date: { $gte: today },
      $or: [
        { for: ["student"] },
        { for: s_id },
        {
          $and: [
            { "for.0": { $elemMatch: { $in: [year] } } }, 
            { "for.1": { $elemMatch: { $in: [branch] } } }, 
            { "for.2": { $in: skillMatch } } 
          ]
        }
      ]
    });

    if (!notices) return res.status(404).json({ 
      success : false, 
      message : "No available notices for this student" 
    });

    return res.status(200).json({
      success: true,
      count : notices.length,
      data : notices
    });
    
  } catch (error) {
    console.error("Error fetching notices:", error);
    return res.status(500).json({ 
      success : false, 
      message : "Server error", 
      error : error.message 
    });
  }
};