import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import userUseCase from '../../Application/Usecase/userUsecase.js'
import recruiterUseCase from '../../Application/Usecase/recruiterUsecase.js'
dotenv.config()

const Middleware={

    authMiddleware:async(req,res,next)=>{
        try {
            const token=req.cookies.accessToken
            if(!token){
                return res.status(400).json({message:"Access denied. No token found"})
            }
            const decoded=jwt.verify(token,process.env.KEY)
            const user=await userUseCase.getUserByEmail(decoded.email)
            if(!user){
                return res.status(401).json({message:"User not found"})
            }
            req.user=user
            next()
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    },
    recruiterMiddleware:async(req,res,next)=>{
        try {
            const token=req.cookies.recruiteraccessToken
            if(!token){

            return res.status(400).json({message:"Access denied. No token found"})
            }
            const decoded=jwt.verify(token,process.env.KEY)
            const recruiter=await recruiterUseCase.getRecruiterByEmail(decoded.email)
            if(!recruiter){
                return res.status(401).json({message:"Recruiter not found"})
            }
            // req.recruiter=recruiter
            req.recruiter = {
                ...recruiter,
                email: decoded.email 
            };
            next()
    
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}

export default Middleware