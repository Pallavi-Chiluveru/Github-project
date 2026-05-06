import exp from 'express'
import {connect} from 'mongoose'
import { config } from 'dotenv';
import { userApp } from './APIs/UserAPI.js';
import { repoApp } from './APIs/RepoAPI.js';
import { collabApp } from './APIs/CollabAPI.js';
import { issueApp } from './APIs/issueAPI.js';
import { fileApp } from './APIs/fileAPI.js';
import { prApp } from './APIs/prAPI.js';
import { commitApp } from './APIs/commitAPI.js';
import { notificationApp } from './APIs/notificationAPI.js';

import cookieParser from "cookie-parser";
import cors from "cors";

config();
const app= exp()
//middle wares
app.use(cors({
  origin: process.env.CLIENT_URL || ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
}));
app.use(exp.json());
app.use(cookieParser());
const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL);
    console.log("connected to database");

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`server started on port ${port}`))
    }
    catch(err){
        console.log("error in db connection");
    }
}
connectDB();

app.use('/user-api',userApp);
app.use('/repo-api',repoApp);
app.use('/collab-api',collabApp);
app.use('/issue-api',issueApp);
app.use('/file-api',fileApp);
app.use('/commit-api',commitApp);
app.use('/pr-api',prApp);
app.use('/notification-api',notificationApp);


// error handling middleware[ALWAYS KEEP AT END OF THE FILE]
app.use((err, req, res, next) => {
  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Error cause:", err.cause);
  console.log("Full error:", JSON.stringify(err, null, 2));

  // ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  // CastError
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  // Duplicate key error
  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`
    });
  }

  // Server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error"
  });
});
