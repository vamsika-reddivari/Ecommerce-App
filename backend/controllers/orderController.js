import orderModel from "../models/orderModel.js";  
import userModel from "../models/userModel.js"; 


//placing order through cod
const placeOrder = async(req,res)=>{
    const { userId, items, amount, address } = req.body;

    try {
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error placing order" });
    }
}

//placing order through stripe payment gateway
const placeOrderStripe = async(req,res)=>{
  const { userId, items, amount, address } = req.body;

  try {
    const newOrder = new orderModel({
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: true,
      date: Date.now(),
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully with Stripe (fake for now)" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing Stripe order" });
  }
 
}



//placing order through Razorpay payment gateway
const placeOrderRazorpay = async(req,res)=>{
   const { userId, items, amount, address } = req.body;

  try {
    const newOrder = new orderModel({
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: true,
      date: Date.now(),
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully with Razorpay (fake for now)" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing Razorpay order" });
  }
}

//user orders through userId
const  userOrders= async(req,res)=>{

  const { userId } = req.body;

  try {
    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to get user orders" });
  }
}

//all orders in admin panel

const allOrders = async(req,res)=>{

  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
    
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to get all orders" });
  }

}


//updating order status

const updateStatus = async(req,res)=>{
   const { orderId, status } = req.body;

  try {
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating status" });
  }
}


export {placeOrder,placeOrderRazorpay,placeOrderStripe,userOrders,allOrders,updateStatus}