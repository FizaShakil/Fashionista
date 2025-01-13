import React from 'react'
import Heading from '../Reusable-subComponents/Heading'
import productList from '../../../src/productList'
import { Link } from 'react-router-dom'

const Women = () => {
  const womenProducts = productList.filter((product) => product.gender === 'Female');
  return (
    <div className="py-8">
      <Heading heading="Women" />
      
      {/* Responsive Wrapper */}
      <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 mb-8">
        {womenProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-2xl transition duration-200"
          >
                  {/* Product Image */}
                  <Link to={`/productpage/${index}`}>
                <img
                     src={product.imageLink}
                    alt={product.imageAlt || "Product Image"}
                    className="w-full h-48 object-cover rounded-md mb-4"
                 />
                 </Link>

                  {/* Product Name */}
                 <h3 className="text-lg font-semibold">{product.productName}</h3>

                  {/* Product Price */}
                 <p className="text-sm text-gray-600 mt-1">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Women