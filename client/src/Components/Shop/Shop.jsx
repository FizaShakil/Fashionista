import React from 'react'
import Heading2 from '../Reusable-subComponents/Heading2'
import ProductGrid from '../Reusable-subComponents/ProductGrid'

const Shop = () => (
  <div className="pb-8">
    <Heading2
      h1={"Ready to Style?"}
      h2={"Shop Now"}
      line={"Your ultimate destination for fashion, style, and self-expression."}
    />
    <ProductGrid />
  </div>
)

export default Shop
