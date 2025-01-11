import React from 'react'
import Heading from '../Reusable-subComponents/Heading'
import ContentDiv from './ContentDiv'

const AboutUs = () => {
  return (
    <div>
      <Heading heading={"About Us"}/>
     <div className='mb-32'>
           <ContentDiv subHead={"Our History"}/>
           <ContentDiv subHead={"The Brand"}/>
           <ContentDiv subHead={"Our Vision"}/>
     </div>
      </div>
  )
}

export default AboutUs