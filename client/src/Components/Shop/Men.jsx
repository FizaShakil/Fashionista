import React from 'react'
import Heading from '../Reusable-subComponents/Heading'
import productList from '../../../src/productList'
import { Link } from 'react-router-dom'
import { addToCart } from '../../Redux/cartSlice'
import { useDispatch } from 'react-redux'

const Men = () => {
  const menProducts = productList.filter((product) => product.gender === 'Male');
  const dispatch = useDispatch()
  return (
    <div className="py-8">
      <Heading heading="Men" />
      
      {/* Responsive Wrapper */}
      <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 mb-8">
        {menProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-2xl transition duration-200"
          >
                  {/* Product Image */}
                  <Link to={`/productpage/${product.id}`}>
                <img
                     src={product.imageLink}
                    alt={product.imageAlt || "Product Image"}
                    className="w-full h-48 object-cover rounded-md mb-4"
                 />
                 </Link>

                  {/* Product Name */}
                 <h3 className="text-lg font-semibold">{product.productName}</h3>

                  {/* Product Price */}
                 <p className="text-sm text-gray-600 mt-1">PKR {product.price}</p>
                 <button 
                         className="mt-2 border-2 px-4 py-1 rounded-md bg-black text-white hover:bg-slate-50
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

export default Men