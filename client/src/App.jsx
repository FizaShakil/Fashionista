import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import axiosInstance from './axiosInstance.js';
import { setUser, logout } from './Redux/userSlice.js';
import { useLocation } from "react-router-dom";
import Header from '../src/Components/ComponentsMain/Header.jsx';
import Footer from '../src/Components/ComponentsMain/Footer.jsx';
import Home from './Components/HomePage/Home.jsx';
import AboutUs from './Components/About Us/AboutUs.jsx';
import NewArrival from './Components/NewArrival/NewArrival.jsx';
import Men from './Components/Shop/Men.jsx';
import Women from './Components/Shop/Women.jsx';
import ProductPage from './Components/ProductPage/ProductPage.jsx';
import Login from './Components/Login-Signup/Login.jsx';
import Signup from './Components/Login-Signup/Signup.jsx';
import AddToCart from './Components/AddToCart/AddToCart.jsx';
import Account from './Components/ComponentsMain/Account.jsx';
import ContactUs from './Components/ComponentsMain/ContactUs.jsx';
import { useDispatch } from 'react-redux';

const App = () => {

  const dispatch = useDispatch()
   useEffect(() => {
    axiosInstance
      .get("/api/v1/users/me")
      .then((res) => {
        dispatch(setUser(res.data.user));
        console.log("Fullresponse: ", res.data.user)
      })
      .catch(() => {
        dispatch(logout());
      });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Header />

      {/* Main Content */}
      <div className="min-h-[450px]">
        <Routes>
          {/* Home component displayed on root and when clicking "Home" */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Other routes */}
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/newarrival" element={<NewArrival />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/productpage/:productId" element={<ProductPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/account' element={<Account/>}/>
          <Route path='/contactus' element={<ContactUs/>}/>
          <Route path='/addtocart' element={<AddToCart />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    if (pathname.startsWith("/productpage/") || pathname === "/login" || pathname === "/signup") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default App;
