import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const isAdmin = async (req, res,next) => {
  try {
    const token = req.cookies.token;

    if (!token) {

      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded token:', decoded); // Log decoded token payload
    const user = await UserModel.findById(decoded.userId)
    console.log('User:', user);
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized: User not found' });
  }

  if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: User is not an admin' });
  }

  req.user = user;
  next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });


  }
}

export { isAdmin }