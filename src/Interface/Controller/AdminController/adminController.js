import adminUseCase from "../../../Application/Usecase/adminUsecase.js"


const adminController={

 postLogin:async(req,res)=>{
       try {
            const{email,password}=req.body
            const adminData={email,password}
            const loginResult=await adminUseCase.adminLogin(adminData)
            if(loginResult.message){
                  res.status(400).json({success:false,message:loginResult.message})
            }else{
                  const {admin,token}=loginResult
                  res.cookie('adminaccessToken',String(token), { httpOnly: true, maxAge: 3600000 })
                   res.status(200).json({success:true,message:"Admin login successfully",admin,token})
            }
       } catch (error) {
         res.status(500).send({message:"Internal server error"})
       }
 },
 adminVerified:async(req,res)=>{
      try {
            res.status(200).json({success:true,message:"Recruiter verified"})
      } catch (error) {
            res.status(500).json({ message: "Internal server error" })
      }
 }
}
export default adminController