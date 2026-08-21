import 'dotenv/config';
import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI;

async function fetchStudents() {
  try {
    await mongoose.connect(URI);
    console.log("✅ Connected to MongoDB\n");
    
    const logins = mongoose.connection.db.collection('logins');
    const students = await logins.find({}).toArray();
    
    console.log("📋 STUDENT CREDENTIALS:\n");
    console.log("=".repeat(80));
    
    students.forEach((student, index) => {
      console.log(`\n👤 Student ${index + 1}:`);
      console.log(`   Name: ${student.name}`);
      console.log(`   Student ID: ${student.s_id}`);
      console.log(`   Username: ${student.username}`);
      console.log(`   Password (hashed): ${student.password.substring(0, 50)}...`);
      console.log(`   Role: ${student.role}`);
      console.log(`   Setup Complete: ${student.setup}`);
    });
    
    console.log("\n" + "=".repeat(80));
    console.log("\n⚠️  Passwords are hashed with argon2 - cannot be reversed");
    console.log("💡 Options:");
    console.log("   1. Use the password reset script (I can create one)");
    console.log("   2. Register a new student with known credentials");
    
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fetchStudents();
