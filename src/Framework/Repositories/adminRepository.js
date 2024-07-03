import { Admin } from "../../Core/Entities/adminCollection.js";

const adminRepository={
   findAdminByEmail:async(email)=>{
     try {
        return await Admin.findOne({email:email})
     } catch (error) {
        console.log(error);
     }
   }
}
export default adminRepository