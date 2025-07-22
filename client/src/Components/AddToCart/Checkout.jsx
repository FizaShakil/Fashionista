import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { clearCart } from "../../Redux/cartSlice";
import { calculateShippingFee, calculateTotal, hasShippingDiscount } from "../../utils/shippingUtils";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get cart items and user from Redux
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    paymentMethod: "Cash on Delivery",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Payment method options from order model
  const paymentMethods = [
    "Cash on Delivery",
    "Credit Card", 
    "Easypaisa"
  ];

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Calculate shipping fee and total using utility functions
  const shippingFee = calculateShippingFee(subtotal);
  const total = calculateTotal(subtotal);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    // Validate form data
    if (!formData.name || !formData.email || !formData.address || !formData.phone) {
      setError("All fields are required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone number (basic validation)
    if (formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(
        "/api/v1/orders/place-order",
        {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
        }
      );

      setOrderPlaced(true); // <-- Move this BEFORE clearCart
      dispatch(clearCart());
      
      // Redirect to order confirmation page with order details
      navigate('/order-confirmation', {
        state: {
          orderId: response.data.data._id,
          orderAmount: total.toFixed(2)
        }
      });
    } catch (error) {
      console.error("Error placing order:", error);
      setError(
        error.response?.data?.message || 
        "Something went wrong while placing your order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading or redirect if conditions not met
  if (!user || cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between p-6 gap-8 max-w-6xl mx-auto">
      {/* Delivery Information */}
      <div className="w-full md:w-2/3">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Delivery Information</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
          <input
            name="name"
            type="text"
                placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
          <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
            name="address"
                placeholder="Enter your complete delivery address (Home, Street, City)"
            value={formData.address}
            onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
          <input
            name="phone"
            type="tel"
                placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
          />
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full md:w-1/3">
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Order Summary</h3>
          
          {/* Cart Items */}
          <div className="mb-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">PKR {item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">PKR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Fee</span>
              <span className="font-medium">PKR {shippingFee.toFixed(2)}</span>
              {hasShippingDiscount(subtotal) && (
                <span className="text-xs text-green-600 ml-2">(Discounted!)</span>
              )}
        </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">PKR {total.toFixed(2)}</span>
        </div>
        </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Payment Method</h4>
            <select
            name="paymentMethod"
              value={formData.paymentMethod}
            onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
        </div>

          {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Placing Order...
              </div>
            ) : (
              `Place Order - PKR ${total.toFixed(2)}`
            )}
        </button>

          {/* Shipping Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-800">
              <strong>Shipping Info:</strong> Standard delivery within 3-5 business days.
              {hasShippingDiscount(subtotal) && " Free shipping discount applied!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
