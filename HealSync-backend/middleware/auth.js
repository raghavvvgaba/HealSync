const admin = require("../config/firebase");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // Get user from database to verify role
    const user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    
    // Add role to the request
    req.user = { ...decoded, role: user.role };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
