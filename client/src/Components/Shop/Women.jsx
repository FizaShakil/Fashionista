import React from 'react'
import Heading2 from '../Reusable-subComponents/Heading2'
import ProductGrid from '../Reusable-subComponents/ProductGrid'

const Women = () => (
  <div className="pb-8">
    <Heading2
      h1={"Explore Our variety of"}
      h2={"Women"}
      line={"A brand that styles you, as unique as you are!"}
    />
    {/* gender is locked — search, color, price, sale, sort still available */}
    <ProductGrid lockedFilters={{ gender: 'Female' }} />
  </div>
)

export default Women
