import React from 'react'

const Heading = ({heading}) => {
  return (
    <div>
        <div className='text-center font-bold text-3xl mt-14 mb-8 md:text-4xl'>
        {heading}
        </div>
    </div>
  )
}

export default Heading