import express from 'express';

import { allOrder,userOrders,placeOrder,placeOrderStripe,placeOrderRazorPay,updateStatus ,verifyStripe} from "../controllers/orderControllers.js";
import adminAuth from '../middleware/adminAuth.js'
import  authUser  from "../middleware/auth.js";
const orderRouter = express.Router()
//Admin features
orderRouter.post('/list',adminAuth,allOrder)

orderRouter.post('/status',adminAuth,updateStatus)

//payment features

orderRouter.post('/place',authUser,placeOrder)

orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorPay)
//user features

orderRouter.post('/userorders',authUser,userOrders)

//verify stripe payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter
