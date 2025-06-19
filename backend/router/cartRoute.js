import express from "express"
import { addToCart,getUsercart,updateCart } from "../controllers/cartController.js"
import authUser from "../middleware/auth.js"

const carRouter = express.Router()

carRouter.post('/get',authUser,getUsercart)
carRouter.post('/add',authUser,addToCart)
carRouter.post('/update',authUser,updateCart)

export default carRouter