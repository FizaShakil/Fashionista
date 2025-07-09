import { useState } from "react";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    console.log("Order Placed", formData);
    // TODO: send formData to backend to create order
  };

  return (
    <div className="flex flex-col md:flex-row justify-between p-6 gap-8 max-w-6xl mx-auto">
      {/* Delivery Info */}
      <div className="w-full md:w-2/3">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">Delivery Information</h2>
        <div className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
      </div>

      {/* Cart Totals */}
      <div className="w-full md:w-1/3 border p-6 rounded shadow">
        <h2 className="text-lg font-semibold border-b pb-2 mb-4">Cart Totals</h2>
        <div className="mb-2 flex justify-between">
          <span>Subtotal</span>
          <span>$294.00</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span>Shipping Fee</span>
          <span>$10.00</span>
        </div>
        <div className="font-semibold flex justify-between border-t pt-2 mb-4">
          <span>Total</span>
          <span>$304.00</span>
        </div>

        <h2 className="text-lg font-semibold border-b pb-2 mb-4">Payment Method</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="COD"
            checked={formData.paymentMethod === "COD"}
            onChange={handleChange}
          />
          <label htmlFor="cod" className="text-sm">Cash on Delivery</label>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
