import orderModel from "../models/orderModels.js"
import userModel from "../models/userModals.js"
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//global variable

const currency = 'eur'
const deliveryChange =12

//order data for admin panel
const allOrder = async (req,res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//order data for frontend

const userOrders = async (req,res) => {
    try {
        const {userId} = req.body
        const orders = await orderModel.find({userId})
        res.json({success:true,orders })
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//placing order using cash on delivery
const placeOrder = async (req,res) => {
    try {
        const {userId,items,amount,address} = req.body

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:"COD",
            payment:false,
            date:Date.now()
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId,{
            cartData:{}
        })

        res.json({success:true , message:'order placed'})
    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
}

//placing order using Stripe
const placeOrderStripe = async (req,res) => {

    try {
        const {userId,items,amount,address} = req.body
        const {origin} = req.headers 
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:"Stripe",
            payment:false,
            date:Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();
      const line_items = items.map((item)=>({
        price_data:{
            currency : currency,
            product_data: {
                name:item.name,
            },
            unit_amount:item.price * 100
        },
        quantity:item.quantity
      }))

      line_items.push({
        price_data:{
            currency:currency,
            product_data:{
                name:'delivery charge'
            },
            unit_amount:deliveryChange * 100
        },
        quantity:1
      })

      const session = await stripe.checkout.sessions.create({
        success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
        line_items,
        mode:'payment'
      }) 

      res.json({success:true, session_url:session.url})


    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
    
}

//verify stripe payment
const verifyStripe = async (req,res) => {
    const {orderId,success,userId} = req.body

    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId,{payment:true})

            await orderModel.findByIdAndUpdate(userId,{cartData:{}})

            res.json({success:true})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:true})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})  
    }
}

//placing order using RazorPay
const placeOrderRazorPay = async (req,res) => {
    
}

//handle updating status from admin panel
const updateStatus = async (req,res) => {
    try {
        const{orderId,status} = req.body
        console.log('🔁 Reçu pour mise à jour :', orderId, status);
        
        await orderModel.findByIdAndUpdate(orderId,{status})

        res.json({success:true,message:'status updated'})
    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
}

export{ allOrder,userOrders,placeOrder,placeOrderStripe,placeOrderRazorPay,updateStatus,verifyStripe}