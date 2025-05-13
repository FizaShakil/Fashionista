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
      const res = await axiosInstance.post('/api/v1/products/upload-product-details', 
          formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
      )
      console.log("Uploaded ", res.data)
      localStorage.removeItem("addItemForm");
      setForm({
        name: "",
        productUniqueID: "",
        description: "",
        price: "",
        gender: "",
        newArrival: false,
        image: null,
    });
     navigate('/')
     
    } catch (error) {
      console.log("Error occured: ", error)
    }

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block mb-2 font-medium">Upload Image</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
      </div>

      <div>
        <label className="block mb-2">Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter name"
        />
      </div>

      <div>
        <label className="block mb-2">Product Unique ID</label>
        <input
          type="text"
          name="productUniqueID"
          value={form.productUniqueID}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Unique ID"
        />
      </div>

      <div>
        <label className="block mb-2">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter description"
        ></textarea>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-2">Price (PKR)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex-1">
          <label className="block mb-2">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="newArrival"
          checked={form.newArrival}
          onChange={handleChange}
        />
        <label>Add to New Arrivals</label>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        <i className="fas fa-upload mr-2"></i> Add
      </button>
    </form>
  );
}
export default AddItems