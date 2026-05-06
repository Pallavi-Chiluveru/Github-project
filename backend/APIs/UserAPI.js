import exp from "express";
import { UserModel } from "../models/UserModel.js";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { verifyToken } from "../middleware/verifyToken.js";

export const userApp = exp.Router();
config();

function signUser(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
    },
    process.env.KEY,
    { expiresIn: "1h" }
  );
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
}

/* REGISTER */
userApp.post("/register", async (req, res) => {
  try {
    const newUser = req.body;

    // hash password
    newUser.password = await hash(newUser.password, 12);

    // save user
    const userDocument = new UserModel(newUser);
    await userDocument.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error occurred", error: err.message });
  }
});

/* LOGIN */
userApp.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // check password
    const isMatched = await compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const signedToken = signUser(user);

    setAuthCookie(res, signedToken);

    // remove password before sending response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
  message: "Login Successful",
  token: signedToken,   // add this
  payload: userObj
});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error occurred", error: err.message });
  }
});


userApp.post('/logout',async(req,res)=>{
     // delete the teoken from the cookie storage
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    })
    res.status(200).json({ message: "Logged out successfully" });
})

/* SEARCH USER */
userApp.get("/search/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email }).select("username email _id profileImageUrl");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "error occurred", error: err.message });
  }
});

