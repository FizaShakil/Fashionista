import React from 'react'

const BrowseByCategoryDiv = ({category, classes, imageLink, imgClasses, redirectLink}) => {
  return (
    <div>
        <div 
            className={`w-[75%] sm:w-[60%] h-52 bg-cover overflow-hidden bg-slate-200 relative left-1/2 transform -translate-x-1/2
                          rounded-xl max- mb-4 ${classes} group cursor-pointer`}
            onClick={() => window.location.href = redirectLink}>  {/*  Redirect on click */}
                            <img
                                src={imageLink} 
                                alt={category} 
                                className={`bg-cover relative left-1/2 transform -translate-x-1/2 ${imgClasses}`}/>
                                
                                <div 
                                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                                  <p className="text-white text-lg font-bold">{category}</p>
                               </div>
        </div>
    </div>
  )
}

export default BrowseByCategoryDiv