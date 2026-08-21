import jwt from 'jsonwebtoken';

export const authCheck = (req, res, next) => {
  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({
    success : false, 
    message: "Unauthorized"
  });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ 
      success : false, 
      message : "Invalid token"
    });
  }
};

export const setupCheck = (req, res, next) => {
  if (req.user.role[0] === "student" && req.user.setup === false) {
    return res.status(403).json({ 
      success : false, 
      message : "Account setup required. Please complete your profile setup first."
    });
  }
  next();
};