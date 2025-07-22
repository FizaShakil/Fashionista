import React from 'react'
import { Link , LinkMain } from './subComponents/FooterLinks'
import SubscribeNewsletter from './subComponents/SubscribeNewsletter'

const Footer = () => {
  return (
    <>
      <SubscribeNewsletter/>
    <div className='ml-6 mb-10 md:flex md:justify-between'>
    <div className="text-[28px] font-bold text-[#193246] md:relative mt-8 md:top-5">
           <p className='logo'>Fashionista</p> 
            <p className="text-xs font-medium mb-5 Mainfont relative bottom-2">An ultimate fashion hub for you </p>
            <div className='flex w-[150px] justify-between'>
              <i className='fa-facebook fa-brands'></i>
              <i className='fa-instagram fa-brands'></i>
              <i className='fa-twitter fa-brands'></i>
              <i className='fa-tiktok fa-brands'></i>
            </div>
    </div>
    <div className='sm:flex sm:justify-evenly md:w-[75%] text-[#193246'>
      <div>
    <LinkMain main={"Shop"}/>
            <Link link={"Men"}/>
            <Link link={"Women"}/>
            <Link link={"New Arrival"}/>
            <Link link={"Browse Category"}/>
       </div>
       <div>
      <LinkMain main={"Company"}/>
            <Link link={"About"}/>
            <Link link={"Features"}/>
            <Link link={"Careers"}/>
            <Link link={"Works"}/>
       </div>
       <div>
      <LinkMain main={"FAQ"}/>
            <Link link={"Account"}/>
            <Link link={"Order Tracking"}/>
            <Link link={"Payments"}/>
            <Link link={"Report Issue"}/>
        </div>
        <div>
      <LinkMain main={"Help"}/>
            <Link link={"Customer Support"}/>
            <Link link={"Details"}/>
            <Link link={"Privacy Policy"}/>
            <Link link={"Terms and Conditions"}/>
        </div>
    </div>
    </div>
    <hr />
    <p className='text-center my-5 text-xs sm:text-sm '>Fashionista @2024 - Developed by Fiza Shakil - All rights reserved</p>
    </>
  )
}

export default Footer