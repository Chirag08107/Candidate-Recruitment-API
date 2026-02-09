const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register Controller
const registerUser = async (req, res) => {
  try{
    const {name, email, password, role} = req.body;

    //check if the user already exists
    const existingUser = await User.findOne({email});
    if (existingUser){
      return res.status(400).json({message: "User already exists"});
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({
      name, 
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

//login controller
const loginUser = async(req, res) => {
  try {
    const {email, password} = req.body;

    //check if user exists 
    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    //generate JWT token 
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    //send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {registerUser, loginUser};