import UserModel from "../models/user.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



const Register = async (req, res) => {
  try {
    const { FullName, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Handle profile image if uploaded
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.filename;  // Only assign if the file is present
    }

    // Hash the password
    const hashPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const NewUser = new UserModel({
      FullName,
      email,
      password: hashPassword,
      profile: imagePath,  // Will be null if no file is uploaded
    });

    // Save the new user to the database
    await NewUser.save();

    return res.status(200).json({ success: true, message: "User registered successfully", user: NewUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


const Login = async (req, res) => {
  try {
      // Log the request body to ensure the fields are received correctly
   

      // Destructure email and password from request body
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
          return res.status(400).json({ success: false, message: "All fields are required" });
      }

      // Check if the user exists in the database
      const FindUser = await UserModel.findOne({ email });
      if (!FindUser) {
          return res.status(404).json({ success: false, message: "Account not found. Please register." });
      }

      // Compare the provided password with the hashed password stored in the database
      const comparePassword = await bcrypt.compare(password, FindUser.password);
      if (!comparePassword) {
          return res.status(401).json({ success: false, message: "Invalid password" });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: FindUser._id }, process.env.JWT_SECRET);

      // Set the JWT token as an HTTP-only cookie (optional)
      
      res.cookie('token', token, {
          httpOnly: true,
          secure: false, // Set to true if you're using HTTPS
          maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
      });

      // Respond with success and return the user data and token
      return res.status(200).json({ 
          success: true, 
          message: "Login successful", 
          user: FindUser, 
          token 
      });
  } catch (error) {
      console.error('Error during login', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
const Logout=async(req,res)=>{
  try {
      // Clear the token cookie
      res.clearCookie('token');

      // Return success message
      res.status(200).json({ message: "Logout successful" });
  } catch (error) {
      // Handle error
      console.error("Error logging out:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}

const updateProfile = async (req, res) => {
  try {
      const userId = req.params.id;
      const { FullName, oldpassword, newpassword } = req.body;

      // Find the user by ID
      const ExistUser = await UserModel.findById(userId);
      if (!ExistUser) {
          return res.status(404).json({ success: false, message: "Account not found." });
      }

      // Check if old password and new password are provided and validate old password
      if (oldpassword) {
          const comparePassword = await bcrypt.compare(oldpassword, ExistUser.password);
          if (!comparePassword) {
              return res.status(401).json({ success: false, message: "Old password is incorrect." });
          }
      }

      // Update FullName if provided
      if (FullName) {
          ExistUser.FullName = FullName;
      }

      // Update password if old and new passwords are provided and valid
      if (oldpassword && newpassword) {
          const hashedPassword = await bcrypt.hash(newpassword, 10);
          ExistUser.password = hashedPassword;
      } else if (oldpassword && !newpassword) {
          return res.status(400).json({ success: false, message: "New password is required when old password is provided." });
      }

      

  
      await ExistUser.save();

      // Return success response
      res.status(200).json({ success: true, message: "Profile updated successfully.", user: ExistUser });

  } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {Register,Login,Logout,updateProfile}