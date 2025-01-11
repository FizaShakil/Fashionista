import React from 'react'

const SubscribeNewsletter = () => {
  return (
    <div>
        <div className='w-[90%] md:w[75%] mt-8 h-[250px] sm:h-[190px] text-center bg-gray-950 rounded-3xl text-white relative left-1/2 transform -translate-x-1/2'>
         <p className=' font-bold text-2xl pt-3 w-[95%] text-center'>Want updates? Subscribe to our Newsletter</p>
            <div className='flex flex-col items-center'>
              <input type="text" className='rounded-3xl mt-5 text-center hover:bg-gray-100 duration-300 w-[80%] h-[40px] sm:w-[50%]' placeholder='Enter your email address'/>
              <button className='rounded-3xl mt-5 font-semibold bg-gray-100 hover:bg-gray-200 duration-500 h-[40px] text-black w-[80%] sm:w-[30%]'>
                     Subscribe now
              </button>
            </div>
      </div>
    </div>
  )
}

export default SubscribeNewsletter