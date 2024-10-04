import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const connectDB=async()=>{
    try {
        console.log(process.env.MONGODB_URL,"DB");
        
        await mongoose.connect(process.env.MONGODB_URL, { 
        })
        console.log("MongoDb connected");
    } catch (error) {
        console.error("Error while connecting to Db",error)
    }
}
export default connectDB