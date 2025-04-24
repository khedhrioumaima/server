import userModel from "../models/userModals.js"
import validator from 'validator'
import  bcrypt  from "bcrypt"
import jwt from 'jsonwebtoken'


const createToken =(id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET);
}
//console.log("Requête reçue :", req.body);

const loginUser =async (req,res) => {
    
    try {

        const {email,password}=req.body
        const user = await userModel.findOne({email})

        if (!user) {
            return res.status(404).json({error:"User not found"})
            //console.log("Utilisateur non trouvé avec l'email :", email);
        }
        const isMatch= await bcrypt.compare(password,user.password)

        if (isMatch) {
            const token=createToken(user._id)
            res.json({ success: true, message:'login successfuly', token }) // ✅ correction ici

        }
        else{
            res.json({success:false,message:"Incorrect password entered"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
}


const registerUser =async (req,res) => {
    try {

        const{name,email,password}= req.body
        //check if user exist already
        const exists= await userModel.findOne({email})

        if(exists){
          return  res.status(400).json({message:"user already exist"})
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({success:false ,message:"Invalid email"})
        }

        if (password.length < 8) {
            return res.status(400).json({success:false ,message:"Please enter strong password"})
        }

        //hash user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //create user
        const newUser = new userModel({
            name,email,password:hashedPassword
        })


        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, message:'Account created successfully', token }) // ✅ correction ici

        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:message.error})
    }
}


const adminLogin =async (req,res) => {
    try {
        const {email,password}=req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
              //console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL)
             //console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD)

            res.json({success:true,token})
        } else{
            res.json({success:false,message:"invalid details"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:message.error})
    }
}

export{loginUser,registerUser,adminLogin}