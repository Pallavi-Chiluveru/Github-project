
import {config} from 'dotenv'
config()
import exp from 'express'
const app=exp()
import {connect} from 'mongoose'
import { Auth } from './APIs/Auth.js'
import { Repo } from './APIs/Repo.js'

// import { Collabration } from './APIs/Collabration.js'
// import { Issue } from './APIs/Issue.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

//body parser middleware
app.use(exp.json());
//add cookie parser .
app.use(cookieParser())
app.use(cors({
    origin: true, // Allow all origins for debugging
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
//path level middleware
app.use('/auth',Auth);
app.use('/repo',Repo)
// app.use('/colab',Collabration);
// app.use('/iss',Issue);

//connect to db
const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB connected ");
        //assign port
        const port=process.env.PORT || 5000
        app.listen(port,()=>console.log("server listening on port : ",port))
    }
    catch(err){
        console.log("err in db connection : ",err)
    }
}

connectDB()
//to handle invalid path
app.use((req,res,next)=>{
    console.log(req.url)
    res.status(404).json({message:`path ${req.url} is invalid`})
})


//error handling middleware
app.use((err,req,res,next)=>{
    console.log(err.name)
    console.log(err.code)
    if(err.name==='ValidationError'){
        return res.status(400).json({message:"Error occured",error:err.message})
    }
if(err.name==="CastError"){
    return  res.status(400).json({message:"Invalid User id",error:err.message})
}
    res.status(500).json({message:"Error occured",error:`Server side error ${err}`})
})