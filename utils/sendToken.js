
export const sendToken=(res,user,message,statusCode)=>{
console.log(user)
const token=user.getJWTToken()
const options={
    expires:new Date(Date.now()+15*24*60*60*1000),
    httpOnly:true,
    // secure:true,
    sameSite:"none"
}
    user.token=token;
    user.save();
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        message,
        user,token
    })
}