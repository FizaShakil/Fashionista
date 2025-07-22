import React from 'react'
import LandingPortrait from './../../../Images/manImage.png'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <>
    <div className='md:flex md:flex-row md:justify-evenly md:mt-10 pb-5'>
      <div className="font-bold text-4xl mt-9 w-[90%] ml-4 md:w-[40%] md:text-5xl 
                     lg:relative lg:top-12 text-[#193246]" >
        Shop the outfit that fits you perfectly
           <div className='font-normal text-base mt-5'>
          Explore our wide range of clothes, which contains a huge variety of male & female outfit, that matches your style and mind
          </div>
          <Link to="/shop">
          <button 
              className='rounded-3xl mt-5 text-base font-semibold hover:shadow-2xl bg-[#193246] hover:bg-white hover:text-black hover:border-2 hover:border-black hover:underline duration-500 h-[50px] text-white w-[80%] sm:w-[40%]
                            relative left-1/2 transform -translate-x-1/2 md:left-0 md:-translate-x-0'>
            Shop Now
            </button>
          </Link>
      </div>
      <div className='w-[90%] mt-6 sm:w-[440px] relative left-1/2 transform -translate-x-1/2 md:left-0 md:-translate-x-0 md:w-[40%]'>
        <img src={LandingPortrait} alt="LandingPortrait" />
      </div>
    </div>
    <hr />
    </>
  )
}

export default LandingPage 