import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//-------------------REGISTER------------------//

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Check if all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ✅ Check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // ✅ Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create and save the new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

   const user = await newUser.save();

   const token = createToken(user._id)

    res.status(201).json({success:true,token})

  } catch (err) {
    console.error("Error in registerUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//------------------LOGIN----------------//

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate presence of email and password
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2. Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // 3. Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 5. Create JWT token
    const token = createToken(user._id);

    // 6. Send response with token
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};


const adminLogin = async (req, res) => {
   try {
     
    const {email,password}= req.body

    if(email === process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email+password,process.env.JWT_SECRET);
      res.json({success:true,token})
    }else{
      res.json({success:false,message:"invalid credintials"})
    }
    
   } catch (error) {

     console.log(error);
     res.json({success:false,message:error.message})
    
   }
};

export { loginUser, registerUser, adminLogin };

