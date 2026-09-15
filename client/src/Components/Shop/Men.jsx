import React from 'react'
import Heading2 from '../Reusable-subComponents/Heading2'
import ProductGrid from '../Reusable-subComponents/ProductGrid'

const Men = () => (
  <div className="pb-8">
    <Heading2
      h1={"Explore Our variety of"}
      h2={"Men"}
      line={"Its time to look bold, courageous and confident!"}
    />
    {/* gender is locked — search, color, price, sale, sort still available */}
    <ProductGrid lockedFilters={{ gender: 'Male' }} />
  </div>
)

export default Men
