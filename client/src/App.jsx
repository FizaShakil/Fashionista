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
import Shop from './Components/Shop/Shop.jsx';
import Men from './Components/Shop/Men.jsx';
import Women from './Components/Shop/Women.jsx';
import ProductPage from './Components/ProductPage/ProductPage.jsx';
import Login from './Components/Login-Signup/Login.jsx';
import Signup from './Components/Login-Signup/Signup.jsx';
import AddToCart from './Components/AddToCart/AddToCart.jsx';
import Account from './Components/ComponentsMain/Account.jsx';
import ContactUs from './Components/ComponentsMain/ContactUs.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from './Redux/cartSlice.js';
import Checkout from './Components/AddToCart/Checkout.jsx';
import OrderConfirmation from './Components/AddToCart/OrderConfirmation.jsx';
import MyOrders from './Components/ComponentsMain/MyOrders.jsx';


const App = () => {

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  
  useEffect(() => {
    // Only check for client authentication if not in admin panel
    const isAdminPanel = window.location.hostname.includes('admin') || localStorage.getItem('isAdmin') === 'true';
    
    if (!isAdminPanel) {
      axiosInstance
        .get("/api/v1/users/me")
        .then((res) => {
          dispatch(setUser(res.data.user));
          console.log("Fullresponse: ", res.data.user)
        })
        .catch(() => {
          dispatch(logout());
        });
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      if (user?._id) {
        // User is logged in - fetch from database
        try {
          const res = await axiosInstance.get(`/api/v1/cart/get-cart`);
          
          if (res.data.data && res.data.data.products) {
            // Transform the cart data to match the expected format
            const cartItems = res.data.data.products.map(item => ({
              ...item.productID,
              quantity: item.quantity
            }));
            dispatch(setCartItems(cartItems));
          } else {
            dispatch(setCartItems([]));
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          dispatch(setCartItems([]));
        }
      } else {
        // User is not logged in - load from localStorage
        try {
     const localCart = JSON.parse(localStorage.getItem("cart")) || [];
          dispatch(setCartItems(localCart));
        } catch (error) {
          console.error("Error loading local cart:", error);
          dispatch(setCartItems([]));
        }
      }
    };
    
    // Only load cart if user state actually changed (not on every render)
    if (user !== undefined) {
      loadCart();
      }
  }, [user?._id]); // Only depend on user ID, not the entire user object


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
          <Route path="/shop" element={<Shop />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/productpage/:productId" element={<ProductPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/account' element={<Account/>}/>
          <Route path='/contactus' element={<ContactUs/>}/>
          <Route path='/addtocart' element={<AddToCart />} />
          <Route path='/checkout' element={<Checkout/>} />
          <Route path='/order-confirmation' element={<OrderConfirmation/>} />
          <Route path='/myorders' element={<MyOrders/>} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
      window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default App;
