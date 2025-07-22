import React from 'react'

const Heading = ({heading}) => {
  return (
    <div>
        <div className='text-center text-[#193246] font-bold text-3xl mt-5 mb-8 md:text-4xl'>
        {heading}
        </div>
    </div>
  )
}

export default Heading