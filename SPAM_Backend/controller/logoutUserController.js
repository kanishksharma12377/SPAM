const logoutUser = async(req, res) => {
  try {
    res.clearCookie("authToken",{
      httpOnly : true, 
      sameSite : "strict"
    });
    return res.status(200).json({
      status : true, 
      message : "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success : false, 
      message : "Server error during logout" ,
      error: error.message 
    });
  }
};

export default logoutUser;