import 'dotenv/config';
import mongoose from 'mongoose';
import argon2 from 'argon2';

const URI = process.env.MONGODB_URI;

async function resetPasswords() {
  try {
    await mongoose.connect(URI);
    console.log("✅ Connected to MongoDB\n");
    
    const logins = mongoose.connection.db.collection('logins');
    
    // Reset both student passwords to "Student@123"
    const newPassword = "Student@123";
    const hashedPassword = await argon2.hash(newPassword);
    
    // Update harsh's password
    const harshResult = await logins.updateOne(
      { username: "harsh" },
      { $set: { password: hashedPassword } }
    );
    
    // Update kanishk's password
    const kanishkResult = await logins.updateOne(
      { username: "kanishk" },
      { $set: { password: hashedPassword } }
    );
    
    console.log("🔐 PASSWORD RESET COMPLETE!\n");
    console.log("=".repeat(80));
    console.log("\n✅ Student Credentials:\n");
    
    console.log("👤 Student 1:");
    console.log("   Name: harsh tailor");
    console.log("   Username: harsh");
    console.log("   Password: Student@123");
    console.log(`   Updated: ${harshResult.modifiedCount > 0 ? 'Yes' : 'No'}\n`);
    
    console.log("👤 Student 2:");
    console.log("   Name: kanishk");
    console.log("   Username: kanishk");
    console.log("   Password: Student@123");
    console.log(`   Updated: ${kanishkResult.modifiedCount > 0 ? 'Yes' : 'No'}\n`);
    
    console.log("=".repeat(80));
    console.log("\n🎯 Now you can login at http://localhost:5173/login");
    console.log("   - Toggle to 'Student'");
    console.log("   - Use username: harsh or kanishk");
    console.log("   - Password: Student@123");
    
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

resetPasswords();
