import React from 'react'

const Heading2 = ({h1,h2,line}) => {
    return (
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-3">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {h1} <span className="text-[#224059]">{h2}</span>
            </h1>
            <p className="text-sm md:text-lg text-black max-w-3xl mx-auto leading-relaxed">
              {line}.
            </p>
          </div>
        </div>
  )
}

export default Heading2