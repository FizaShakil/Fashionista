import React, {useState, useEffect} from "react";
import Heading from '../Reusable-subComponents/Heading'
import { useDispatch } from 'react-redux'
import axiosInstance from "../../axiosInstance";
import { addToCart } from '../../Redux/cartSlice'
import { Link } from 'react-router-dom'

const NewArrival = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    axiosInstance.get('/api/v1/products/get-product-details?newArrival=true')
      .then(res => setNewArrivals(res.data.data))
      .catch(() => setNewArrivals([]));
  }, []);

  return (
    <div className="py-8">
      <Heading heading="New Arrivals" />
      
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
                 <h3 className="text-lg font-semibold">{product.name}</h3>

                  {/* Product Price */}
                 <p className="text-sm text-gray-600 mt-1">PKR {product.price}</p>
                 <button className="mt-2 border-2 px-4 py-1 rounded-md bg-black text-white hover:bg-slate-50
                                                   hover:text-black hover:border-black duration-300 hover:border-[1px]"
                                          onClick={()=> dispatch(addToCart(product))}>
                                                                Add to cart
                  </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewArrival