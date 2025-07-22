import React from 'react'
import LandingPage from "./HomePageComponents/LandingPage"
import NewArrivalComponentHome from './HomePageComponents/NewArrivalComponentHome'
import BrowseByCategory from './HomePageComponents/BrowseByCategory'
import Reviews from './HomePageComponents/Reviews'
import FAQ from './HomePageComponents/FAQ'

const Home = () => {
  return (
    <>
    <LandingPage/>
    <NewArrivalComponentHome/>
    <BrowseByCategory/>
    <Reviews/>
    <FAQ/>
    </>
  )
}

export default Home