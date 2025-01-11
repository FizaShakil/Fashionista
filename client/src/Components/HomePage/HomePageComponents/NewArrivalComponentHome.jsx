import React from "react";
import Heading from "../../Reusable-subComponents/Heading"
import productList from "../../../productList"
import { Link } from "react-router-dom";
import ViewAllButton from '../HomePageComponents/HomePageSubComponents/ViewAllButton'

const NewArrivalComponentHome = () => {
  // Filter products with `newArrival: true`
  const newArrivals = productList.filter((product) => product.newArrival);

  return (
    <div className="py-8">
      <Heading heading="New Arrivals" />
      
      {/* Responsive Wrapper */}
      <div className="new-arrivals-grid w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 mb-8">
        {newArrivals.slice(0,4).map((product, index) => (
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
      <ViewAllButton navigateLink={"/newarrival"}/>
    </div>
  );
};

export default NewArrivalComponentHome;
