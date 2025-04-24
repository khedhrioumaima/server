import userModel from "../models/userModals.js"

const addToCart = async (req,res) => {
    try {
        const {userId,itemId , benefits} = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData
        if (!userData) {
            return res.status(404).json({success:false,message:'User not found'})
        }
        if (cartData[itemId]) {
            if (cartData[itemId][benefits]) {
                cartData[itemId][benefits] += 1
            }else{
                cartData[itemId][benefits] = 1;
            }
        }else{
            cartData[itemId]= {[benefits]:1}
        }

        await userModel.findByIdAndUpdate(userId,{cartData})
        res.json({success:true,message:'product added to cart'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
    
}



const updateCart = async (req,res) => {

    try {
        const {userId,itemId,benefits,quantity} = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData

        cartData[itemId][benefits] = quantity

        await userModel.findByIdAndUpdate(userId,{cartData})
        res.json({success:true,message:'cart updated'})
    } catch (error) {
       console.log(error) 

       res.json({success:false ,message:error.message})
    }
    
}


const getUserCart = async (req,res) => {
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId)

        if (!userData) {
            return res.json({success:false , message:'User not found'})
        }

        const cartData = userData.cartData
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
    
}


export{addToCart, updateCart, getUserCart}