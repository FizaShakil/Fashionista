import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {removeFromCart, updateQuantity, setCartItems} from "../../Redux/cartSlice.js";
import axiosInstance from "../../axiosInstance.js";
import { Link, useNavigate } from 'react-router-dom';
import { calculateShippingFee, calculateTotal, hasShippingDiscount } from "../../utils/shippingUtils";

const AddToCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate()

  const handleQuantityChange = async (product, qty) => {
    dispatch(updateQuantity({ productID: product._id, quantity: qty }));

    if (user?._id) {
      await axiosInstance.patch("/api/v1/cart/update-quantity", {
        productID: product._id,
        action: qty > product.quantity ? 'increment' : 'decrement',
      });
    } 
    else {
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = [...existingCart];
        const index = updatedCart.findIndex((item) => item._id === product._id);

        if (index >= 0) {
         updatedCart[index].quantity = qty;
        } else {
         updatedCart.push({ ...product, quantity: qty });
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handleRemove = async (id) => {
    console.log("Removing item from cart:", id);
    console.log("User object:", user);
    dispatch(removeFromCart(id));

    if (user?._id) {
      try {
        console.log("Sending remove request to server...");
        await axiosInstance.post("/api/v1/cart/remove-from-cart", {
          productID: id
        });
        console.log("Remove request successful");
      } catch (error) {
        console.error("Error removing item from cart:", error);
        // If server call fails, the Redux state will be out of sync
        // But we'll let the user continue and it will sync on next page load
      }
    } 
    else {
      console.log("User not logged in, updating localStorage only");
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updated = localCart.filter(item => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
    }
  };
  const handleCheckout = () => {
    if (!user) {
      alert("Please login to checkout");
      navigate('/login');
      return;
    }
   else if (cartItems.length === 0) {
      alert("Your cart is empty");
      navigate('/addtocart');
      return;
    }
    else{
      navigate('/checkout')
    }
    // navigate to order page
  };
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = calculateShippingFee(subtotal);
  const total = calculateTotal(subtotal);

  return (
    <div className="flex flex-col md:flex-row justify-between gap-8 p-6 w-[90%] mx-auto">
      {/* Left: Product List */}
      <div className="flex-1">
        {cartItems.length === 0 ? (
          <p className="text-center text-2xl font-semibold mt-20">
            Your cart is empty.
          </p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center bg-white shadow-md rounded-lg p-4 mb-6"
            >
              <img
                src={item.productImage}
                alt={item.name}
                className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] object-cover rounded-md mb-4 sm:mb-0 sm:mr-6"
              />
              <div className="flex flex-col flex-grow w-full">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <div className="text-lg font-bold whitespace-nowrap">
                    PKR {Number(item.price) * Number(item.quantity || 1)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Price: PKR {item.price}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(item, Number(item.quantity || 1) - 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-200"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="font-semibold">{Number(item.quantity || 1)}</span>
                  <button
                    onClick={() => handleQuantityChange(item, Number(item.quantity || 1) + 1)}
                    className="px-2 py-1 border rounded hover:bg-gray-200"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500 ml-6 hover:text-red-700"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right: Cart Summary */}
      <div className="md:w-[35%] bg-white shadow-md p-6 rounded-lg h-fit">
        <h2 className="text-2xl font-bold mb-6 text-center">Order Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>PKR {subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Fee</p>
            <p>PKR {shippingFee.toFixed(2)}</p>
            {hasShippingDiscount(subtotal) && (
              <span className="text-xs text-green-600 ml-2">(Discounted!)</span>
            )}
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>PKR {total.toFixed(2)}</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Enter Coupon Code"
          className="mt-6 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        
        {/* Shipping Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-800">
                          <strong>Shipping Info:</strong> Standard delivery within 3-5 business days.
              {hasShippingDiscount(subtotal) && " Free shipping discount applied!"}
          </p>
        </div>

        <button className="w-full mt-4 bg-[#193246] text-white py-2 rounded-lg hover:bg-[#244158] transition"
        onClick={handleCheckout}>
          Checkout Now
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
