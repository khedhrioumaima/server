import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next) => {

    try {
        const {token} = req.headers;


        //console.log("🔐 Authorization header:", req.headers['authorization']);


        if (!token) {
            return res.json({success:false,message:'unauthorized user'})
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        //console.log("✅ Token décodé :", token_decode);


        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: 'User not authorized' });
          }
        next()
    } catch (error) {
     return  res.json({success:false,message:error.message}) 
    }
}
export default adminAuth