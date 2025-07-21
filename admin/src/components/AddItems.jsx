import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import axiosInstance from "../../../client/src/axiosInstance";

const AddItems= () =>{
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    productUniqueID: "",
    description: "",
    price: "",
    gender: "",
    newArrival: false,
    image: null,
  });

  useEffect(() => {
  const savedForm = JSON.parse(localStorage.getItem("addItemForm"));
  if (savedForm) {
    setForm(savedForm);
  }
}, []);

 const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;
  let updatedForm = { ...form };

  if (type === "checkbox") {
    updatedForm[name] = checked;
  } else if (type === "file") {
    updatedForm.image = files[0];
  } else {
    updatedForm[name] = value;
  }

  setForm(updatedForm);
  localStorage.setItem("addItemForm", JSON.stringify({
    ...updatedForm,
    image: null // Don't store the actual file in localStorage
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    
   if (!form.image) {
    alert("Please select an image");
    return;
   }

   const formData = new FormData();
   formData.append("name", form.name);
   formData.append("productUniqueID", form.productUniqueID);
   formData.append("description", form.description);
   formData.append("price", form.price);
   formData.append("gender", form.gender);
   formData.append("newArrival", form.newArrival);
   formData.append("productImage", form.image);

    try {
      await axiosInstance.post("/api/v1/products/add-product-details", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully!");
      setForm({
        name: "",
        productUniqueID: "",
        description: "",
        price: "",
        gender: "",
        newArrival: false,
        image: null,
      });
      localStorage.removeItem("addItemForm");
    } catch (error) {
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-8">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Product Unique ID</label>
          <input
            type="text"
            name="productUniqueID"
            value={form.productUniqueID}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter unique ID"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter product description"
            rows={3}
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter price"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Category</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            name="newArrival"
            checked={form.newArrival}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">Mark as New Arrival</label>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Product Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors duration-200 shadow"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddItems;