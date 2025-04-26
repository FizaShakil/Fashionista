import React from 'react'
import productList from '../../productList'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/cartSlice.js';

const ProductPage= () => {
  const { productId } = useParams();
  const product = productList.find((item) => item.id.toString() === productId); // Retrieve product based on ID

  const dispatch = useDispatch()

  if (!product) {
    return <div className='text-center text-3xl font-semibold'>Product not found!</div>;
  }

  const defaultImage = "https://via.placeholder.com/150";

  return (
    <div className="product-details md:flex md:flex-row py-8 w-[80%] md:justify-around mx-auto">
      <div className="bg-white md:w-[40%] shadow-md h-[40h] rounded-lg p-8">
        {/* Handle Missing Image */}
        <img
          src={product.imageLink || defaultImage}
          alt={product.imageAlt || "Product Image"}
          className="w-full h-64 md:h-[50vh] object-cover rounded-md mb-4"
        />
        </div>
        <div className='pt-10 sm:w-[50%]'>
        <h2 className="text-xl md:text-2xl font-bold">{product.productName}</h2>
        <p className="text-lg text-[17px] text-gray-600 pt-2">PKR {product.price}</p>
        <p className="text-base text-slate-900 -500 pt-4">Gender: {product.gender}</p>
        <p className='pt-5 text-xl font-semibold'>Size:</p>
        <div className='flex flex-row mt-1'>
          <button className=' border-2 text-sm sm:text-base border-gray-400 px-2 md:px-5 py-1'>Small</button>
          <button className='ml-4 border-2 text-sm sm:text-base border-gray-400 px-2 md:px-5 py-1'>Medium</button>
          <button className='ml-4 border-2 text-sm sm:text-base border-gray-400 px-2 md:px-5 py-1'>Large</button>
          <button className='ml-4 border-2 text-sm sm:text-base border-gray-400 px-2 md:px-5 py-1'>XL</button>
        </div>
        <p className='pt-6 sm:pt-10 text-xl font-semibold'>Product Description</p>
        <p className='pt-2'>{product.description}</p>
        <button className='border-[2px] bg-black text-white px-5 py-2 mt-3 hover:underline hover:bg-slate-50 hover:border-2 hover:border-black hover:text-black duration-200' 
        onClick={()=> dispatch(addToCart(product))}>Add to cart</button>
        </div>
    </div>
  );
};


export default ProductPage