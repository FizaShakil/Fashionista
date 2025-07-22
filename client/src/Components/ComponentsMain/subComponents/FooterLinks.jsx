import React from 'react'
const Link = ({link})=>{
    return(
        <div>
        <li className='list-none'><a href="#">{link}</a></li>
        </div>
    )
}
const LinkMain = ({main}) => {
  return (
    <div>
      <h1 className='text-2xl footerHead mt-4 text-[#193246]'>{main}</h1>
    </div>
  )
}

export {Link, LinkMain}