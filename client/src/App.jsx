import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../src/Components/ComponentsMain/Header.jsx'
import Footer from '../src/Components/ComponentsMain/Footer.jsx'
import Home from './Components/HomePage/Home.jsx'
import AboutUs from './Components/About Us/AboutUs.jsx'
import NewArrival from './Components/NewArrival/NewArrival.jsx'
import Men from './Components/Shop/Men.jsx'
import Women from './Components/Shop/Women.jsx'
import ProductPage from './Components/ProductPage/ProductPage.jsx';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Login from './Components/Login-Signup/Login.jsx';
import Signup from './Components/Login-Signup/Signup.jsx';

const App = () => {
  return (
    <Router>
      <ScrollToTop/>
      <Header/>
 
      {/* Main Content */}
      <div className="min-h-screen">
        <Routes>
          {/* Home component displayed on root and when clicking "Home" */}
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home />} />

          {/* Other routes */}
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/newarrival" element={<NewArrival />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/productpage/:productId" element={<ProductPage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if the current path is the product details page
    if (pathname.startsWith("/productpage/" || "/login" || "/signup")) {
      window.scrollTo(0, 0); // Scroll to the top
    }
  }, [pathname]);

  return null;
};


export default App;

