import React from 'react'
import Heading from '../Reusable-subComponents/Heading'
import productList from '../../../src/productList'

const NewArrival = () => {
  const newArrivals = productList.filter((product) => product.newArrival);
  return (
    <div className="py-8">
      <Heading heading="New Arrivals" />
      
      {/* Responsive Wrapper */}
      <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 mb-8">
        {newArrivals.map((product, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-2xl transition duration-200"
          >
                  {/* Product Image */}
                <img
                     src={product.imageLink}
                    alt={product.imageAlt || "Product Image"}
                    className="w-full h-48 object-cover rounded-md mb-4"
                 />

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

export default NewArrival