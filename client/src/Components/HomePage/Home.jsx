import React from 'react'
import LandingPage from "./HomePageComponents/LandingPage"
import NewArrivalComponentHome from './HomePageComponents/NewArrivalComponentHome'
import BrowseByCategory from './HomePageComponents/BrowseByCategory'
import Reviews from './HomePageComponents/Reviews'

const Home = () => {
  return (
    <>
    <LandingPage/>
    <NewArrivalComponentHome/>
    <BrowseByCategory/>
    <Reviews/>
    </>
  )
}

export default Home