import React from 'react'
import {Link} from 'react-router-dom'

const ViewAllButton = ({navigateLink}) => {
  return (
    <div>
      <Link to= {navigateLink}>
        <button 
          className='relative left-1/2 transform -translate-x-1/2 rounded-full bg-black text-white
           w-[30%] py-2 hover:underline hover:bg-slate-50 hover:border-2 hover:border-black hover:text-black duration-200 md:w-[15%] mb-5'>
            View more
        </button>
        </Link>
    </div>
  )
}

export default ViewAllButton