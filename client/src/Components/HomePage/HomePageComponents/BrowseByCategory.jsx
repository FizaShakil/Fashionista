import React from 'react'
import TShirt from "../../../Images/T-Shirt-PNG.png"
import Sweater from "../../../Images/Sweaters.png"
import Jacket from "../../../Images/Jacket.png"
import Pant from "../../../Images/Pants.png"
import Heading from '../../Reusable-subComponents/Heading'
import BrowseByCategoryDiv from './HomePageSubComponents/BrowseByCategoryDiv'

const BrowseByCategory = () => {
  return (
    <div>
      <Heading heading={"Browse by Category"}/>
      <div className='md:flex justify-center'>
        <BrowseByCategoryDiv 
               classes="md:w-[400px] lg:w-[450px] "
               category={"T-Shirts"}
               imageLink={TShirt}
               imgClasses={"min-[500px]:bottom-10 md:w-full max-[440px]:w-[300px]"}
               />
        <BrowseByCategoryDiv 
               classes={"md:w-[200px] lg:w-[250px] md:ml-2"}
               category={"Sweater"}
               imageLink={Sweater}
               imgClasses={"bottom-32 w-[250px] md:bottom-20 lg:bottom-[120px]"}/>
      </div>

      <div className='md:flex justify-center'>
      <BrowseByCategoryDiv 
               classes={"md:w-[200px] lg:w-[250px]"}
               category={"Pants"}
               imageLink={Pant}
               imgClasses={"w-[250px] lg:w-[200px]"}
               />
      <BrowseByCategoryDiv 
               classes="md:w-[400px] md:ml-2 lg:w-[450px]"
               category={"Jacket"}
               imageLink={Jacket}
               imgClasses={"min-[500px]:bottom-4 md:w-full max-[440px]:w-[350px]"}/>
      </div>
    </div>
  )
}

export default BrowseByCategory
// t shirt jeans dress jacket