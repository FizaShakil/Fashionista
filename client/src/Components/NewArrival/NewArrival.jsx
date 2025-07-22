import React, {useState, useEffect} from "react";
import Heading from '../Reusable-subComponents/Heading'
import { useHandleAddToCart } from "../Reusable-subComponents/HandleAddToCart";
import axiosInstance from "../../axiosInstance";
import { Link } from 'react-router-dom'
import Heading2 from "../Reusable-subComponents/Heading2";

const NewArrival = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const handleAddToCart = useHandleAddToCart();

  useEffect(() => {
    axiosInstance.get('/api/v1/products/get-product-details?newArrival=true')
      .then(res => setNewArrivals(res.data.data))
      .catch(() => setNewArrivals([]));
  }, []);

  return (
    <div className="">
      <Heading2 h1={"New"} h2={"Arrivals"} 
               line={" Your ultimate destination for fashion, style, and self-expression. We believe everyone deserves to look and feel their best."}
               />  
      {/* Responsive Wrapper */}
      <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 mb-8">
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-2xl transition duration-200"
          >
                  {/* Product Image */}
                  <Link to={`/productpage/${product._id}`}>
                <img
                     src={product.productImage}
                    alt={product.name || "Product Image"}
                    className="w-full h-48 object-cover rounded-md mb-4"
                 />
                 </Link>

                  {/* Product Name */}
                 <h3 className="text-lg font-semibold text-[#0b1a26]">{product.name}</h3>

                  {/* Product Price */}
                 <p className="text-sm text-gray-600 mt-1">PKR {product.price}</p>
               <button className="mt-2 border-2 px-4 py-1 rounded-md bg-[#22425d] text-white hover:bg-slate-50
                                  hover:text-[#22425d] hover:border-[#22425d] duration-300 hover:border-[1px]"
                         onClick={() => handleAddToCart(product)}>
                                               Add to cart
                 </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewArrival