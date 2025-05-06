import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, incrementQuantity, decrementQuantity } from '../../Redux/cartSlice';

const AddToCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
              key={item.id}
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
                    PKR {item.price * item.quantity}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Price: PKR {item.price}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => dispatch(decrementQuantity(item._id))}
                    className="px-2 py-1 border rounded hover:bg-gray-200"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(incrementQuantity(item._id))}
                    className="px-2 py-1 border rounded hover:bg-gray-200"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
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
            <p>PKR {subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Charges</p>
            <p>PKR 500</p>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <p>Total</p>
            <p>PKR {subtotal + 500}</p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Enter Coupon Code"
          className="mt-6 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button className="w-full mt-4 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition">
          Checkout Now
        </button>
        <p className="text-center mt-4 text-sm text-gray-600">
          Please login or register to complete your purchase.
        </p>
      </div>
    </div>
  );
};

export default AddToCart;

