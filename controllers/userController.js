import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// user login

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does nto exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.json({success: false, message: "Invalid Credentials"})
    }
  
    const token = createToken(user._id);
    res.json({success: true, token})

} catch (error) {
    console.log(error)
    res.json({success: false, message: "Error"})
}
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// user registration

const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // checking if email is taken
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: "The email has been used for an account",
      });
    }
    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Input a valid Email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password

    const salt = await bcrypt.genSalt(10);
    const hashedPasssword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPasssword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};



// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, '-password'); // Exclude password from the result
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching users" });
  }
};



const getTotalUsers = async (req, res) => {
  try {
    const count = await userModel.countDocuments({});
    res.json({ success: true, totalUsers: count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving total users" });
  }
};

export { loginUser, registerUser, getAllUsers, getTotalUsers };


