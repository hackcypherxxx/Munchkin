// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export default generateToken;