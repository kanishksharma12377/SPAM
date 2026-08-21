import jwt from 'jsonwebtoken';
import argon2 from "argon2";

import Admin from '../model/adminModel.js';
import Login from '../model/loginModel.js';
import Student from '../model/studentModel.js';

import loginSchema from '../validator/loginSchema.js';
import zodValidator from '../utils/zodValidator.js';

const loginUser = async(req, res) => {
  try {
    let data = zodValidator(loginSchema, req.body, res);
    if (!data) return;
    
    const {role, username, password } = data;
    let user;
    
    if (role === "admin") {
      user = await Admin.findOne({username});
    }
    else if (role === "student") {
      user = await Login.findOne({username});
    }
    else {
      return res.status(400).json({
        success : false, 
        message :"Invalid role"
      });
    }
    
    if(!user) return res.status(404).json({
      success : false, 
      message:"no user with following username"
    });
    
    const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) return res.status(400).json({ 
        success : false, 
        message : "Invalid password"
      });
      
    let setup = false;
    if (role === "admin") {
      setup = true;
    }
    else if (role === "student") {
      const record = await Student.findOne({s_id:user.s_id});
      if (record) setup = true;
    }
    
    const payload ={
      id: user.a_id || user.s_id, 
      name : user.name, 
      role : user.role, 
      setup
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET,{
      expiresIn : "15d"
    });
    
    res.cookie("authToken", token, {
      httpOnly : true, 
      sameSite : "strict", 
      maxAge : 15 * 24 * 60 * 60 * 1000
    });
    
    return res.status(200).json({
      success : true, 
      message : "login successful",
      user : payload
    });
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success : false, 
      message: "Server error",
      error: error.message 
    });
  }
};

export default loginUser;