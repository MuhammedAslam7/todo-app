import bcrypt from "bcrypt"
import { User } from "../model/userSchema.js"

export const signupUser = async(req, res) => {
    try {
        const {username, email,password} = req.body
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({message: "Email is already in use or user exits"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser =  new User({username, email, password: hashedPassword})
        await newUser.save()
        res.status(200).json({message: "User registered"})
    } catch (error) {
         console.error(error);
        res.status(500).json({ message: "Server error" });
        
    }
}

export const loginUser = async(req, res) => {
    try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}