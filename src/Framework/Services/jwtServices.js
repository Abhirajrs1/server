import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateJWT=async(email)=>{
    try {
        const token=jwt.sign({email:email},process.env.KEY,{expiresIn:'1h'})
        return token
    } catch (error) {
        console.log(error);
    }
}