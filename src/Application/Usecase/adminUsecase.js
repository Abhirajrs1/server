import adminRepository from "../../Framework/Repositories/adminRepository.js";
import { generateJWT } from "../../Framework/Services/jwtServices.js";



const adminUseCase={
    adminLogin:async(adminData)=>{
        try {
            const{email,password}=adminData
            const admin=await adminRepository.findAdminByEmail(email)
            if(!admin){
                return {message:"Admin not found"}
            }
            if(password!=admin.password){
                return {message:"Incorrect password"}
            }
            const token=await generateJWT(admin.email)
            return {admin,token}
        } catch (error) {
            return {message:error.message} 
        }
    },
    getAdminByEmail:async(email)=>{
        try {
            const admin=await adminRepository.findAdminByEmail(email)
            if(!admin){
                return {message:"Admin not found"}
            }else{
                {admin}
            }
        } catch (error) {
            
        }
    }

}
export default adminUseCase