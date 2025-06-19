import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const { cartItems, getCartAmount, delivery_fee, navigate, backendUrl, token,products } = useContext(ShopContext)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const placeOrder = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error("Please login to place an order")
      navigate("/login")
      return
    }

    const orderItems = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          const product = products.find(p => p._id === itemId);
          if (!product) continue;

          orderItems.push({
            name: product.name,
            image: product.image,
            size,
            quantity: cartItems[itemId][size]
          });
        }
      }
    }

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
    }

    try {
      switch (method) {
        case 'cod':
          const response = await axios.post(
            backendUrl + '/api/order/place',
            orderData,
            {
              headers: {
                token: token,  // ✅ Using token from ShopContext
              },
            }
          )

          if (response.data.success) {
            toast.success("Order Placed Successfully!")
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break
      
        case 'stripe': {
          const response = await axios.post(
            backendUrl + '/api/order/stripe',
            orderData,
            {
              headers: {
                token: token,  // ✅ Using token from ShopContext
              },
            }
          )

          if (response.data.success) {
            toast.success("Order Placed Successfully!")
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;
      }

      case 'razorpay': {
          const response = await axios.post(
            backendUrl + '/api/order/razorpay',
            orderData,
            {
              headers: {
                token: token,  // ✅ Using token from ShopContext
              },
            }
          )

          if (response.data.success) {
            toast.success("Order Placed Successfully!")
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;
      }


        default:
          toast.error("Select a payment method")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong while placing the order")
    }
  }

  return (
    <form onSubmit={placeOrder} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input name='firstName' value={formData.firstName} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type='text' placeholder='First name' />
          <input name='lastName' value={formData.lastName} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type='text' placeholder='Last name' />
        </div>
        <input name='email' value={formData.email} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type='email' placeholder='Email address' />
        <input name='street' value={formData.street} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type='text' placeholder='Street' />
        <div className='flex gap-3'>
          <input name='city' value={formData.city} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type='text' placeholder='City' />
          <input name='state' value={formData.state} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type='text' placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input name='zipcode' value={formData.zipcode} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type='number' placeholder='Zipcode' />
          <input name='country' value={formData.country} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type='text' placeholder='Country' />
        </div>
        <input name='phone' value={formData.phone} onChange={handleChange} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type='number' placeholder='Phone' />
      </div>

      {/* Right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
