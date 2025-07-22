import React, {useState, useEffect} from "react";
import Heading from "../../Reusable-subComponents/Heading"
import { useHandleAddToCart } from "../../Reusable-subComponents/HandleAddToCart";
import { Link } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import ViewAllButton from '../HomePageComponents/HomePageSubComponents/ViewAllButton'

const NewArrivalComponentHome = () => {
  // Filter products with `newArrival: true`
  const [newArrivals, setNewArrivals] = useState([]);
  const handleAddToCart = useHandleAddToCart();
  
    useEffect(() => {
      axiosInstance.get('/api/v1/products/get-product-details?newArrival=true')
        .then(res => setNewArrivals(res.data.data))
        .catch(() => setNewArrivals([]));
    }, []);

  return (
    <div className="py-8">
      <Heading heading="New Arrivals" />
      
      {/* Responsive Wrapper */}
      <div className="new-arrivals-grid w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 mb-8">
        {newArrivals.slice(0,4).map((product) => (
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
                 
                 <button className="mt-2 border-2 px-4 py-1 rounded-md bg-[#284964] text-white hover:bg-slate-50
                                  hover:text-[#284964] hover:border-[#284964] duration-300 hover:border-[1px]"
                         onClick={() => handleAddToCart(product)}>
                                               Add to cart
                 </button>
          </div>
        ))}
      </div>
      <ViewAllButton navigateLink={"/newarrival"}/>
    </div>
  );
};

export default NewArrivalComponentHome;
