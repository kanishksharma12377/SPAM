import mongoose from 'mongoose';
import argon2 from 'argon2';
import Admin from '../model/adminModel.js';

const URI = process.env.MONGODB_URI;

const connectDb = async () =>{
  try {
    await mongoose.connect(URI);
    console.log("successfully connected to DB");
    
    const existingAdmin = await Admin.findOne({ role: "admin" });
    
    if (!existingAdmin) {
      const hashedPassword = await argon2.hash("Admin@123");

      await Admin.create({
        a_id : "a1",
        username : "teacher",
        password : hashedPassword,
        role : "admin"
      });

      console.log("Default admin created successfully -- \nusernane : teacher, \npassword : Admin@123");
    } 
  } catch (e) {
    console.error("Error while connecting to DB : ", e.message);
    process.exit(1);
  }
};

export default connectDb;