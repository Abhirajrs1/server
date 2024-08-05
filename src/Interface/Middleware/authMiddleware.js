import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import userUseCase from '../../Application/Usecase/userUsecase.js'
import recruiterUseCase from '../../Application/Usecase/recruiterUsecase.js'
import adminUseCase from '../../Application/Usecase/adminUsecase.js'
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
            if (user.block) {
                res.clearCookie('accessToken');
                return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
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
            if (recruiter.block) {
                res.clearCookie('recruiteraccessToken');
                return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
            }
            req.recruiter = {
                ...recruiter,
                email: decoded.email 
            };
            next()
    
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    },
    adminMiddleware:async(req,res,next)=>{
        try {
            const token=req.cookies.adminaccessToken
            if(!token){
                return res.status(400).json({message:"Access denied. No token found"})
            }
            const decoded=jwt.verify(token,process.env.KEY)
            const admin=await adminUseCase.getAdminByEmail(decoded.email)
            if(!admin){
                return res.status(401).json({message:"Admin not found"})
            }
            req.admin={
                ...admin,
                email: decoded.email 
            }
            next()
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    },
    companyMiddleware:async(req,res,next)=>{
        const token=req.cookies.companyaccessToken
        if(!token){
            return res.status(400).json({message:"Access denied. No token found"})
        }
        const decoded=jwt.verify(token,process.env.KEY)
    }
}

export default Middleware