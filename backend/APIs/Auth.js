import exp from "express";
export const Auth = exp.Router();
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserModel } from "../Models/UserModel.js"

// route for register 
Auth.post("/register",async (req, res) => {
  try {
    //get details from req
    const { username, email, password } = req.body
    const newUser=req.body
    //is email unique
    const existing = await UserModel.findOne({ email })
    if (existing) return res.status(400).json({ msg: "User already exists" })
    //hash the password 
    const hashedPassword = await bcrypt.hash(password, 10)
    newUser.password=hashedPassword
    //create New user document
    const newUserDoc = new UserModel(newUser);

    //save document
    await newUserDoc.save();
    //send res
    res.status(201).json({ message: "User created" });

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

// route to login
Auth.post("/login",async (req, res) => {
  try {
    //get user cred
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) return res.status(400).json({ msg: "User not found" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })

    const token = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    )
    res.cookie("token",token,{
      sameSite:"lax",
      httpOnly: true,
      secure: false
    })
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

//route to logout 
Auth.get("/logout", (req, res) => {
  //delete token from cookie storage
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  //send res
  res.status(200).json({ message: "Logout success" });
});