import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux"; 
import UserDropdown from "./UserDropdown";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state)=> state.user.user)

  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <nav className="bg-gray-950 shadow-md pb-2">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            <Link to='/'>
              Fashionista
            </Link>
            <p className="text-xs font-normal">An ultimate fashion hub for you</p>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex space-x-6 text-white md:ml-8 relative">
            <NavLink to="/home"
                 className={({ isActive }) => `hover:text-gray-100 hover:underline ${isActive ? "text-gray-100 underline" : "text-white"}`}>
                  Home
            </NavLink>
            <NavLink to="/aboutus" 
                 className={({ isActive }) => `hover:text-gray-100 hover:underline ${isActive ? "text-gray-100 underline" : "text-white"}`}>
                  About Us
                  </NavLink>
            <NavLink to="/newarrival" 
            className={({ isActive }) => `hover:text-gray-100 hover:underline ${isActive ? "text-gray-100 underline" : "text-white"}`}>
              New Arrivals
            </NavLink>

            {/* Dropdown for Shop */}
            <div
              className="relative group"
              onClick={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <span>Shop</span>
              <i className="fas fa-chevron-down text-sm ml-1"></i>

              {isDropdownOpen && (
                <div className="absolute top-8 left-0 w-40 bg-white shadow-md rounded-md">
                  <NavLink to='/men' className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>Men</NavLink>
                  <NavLink to='/women' className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>Women</NavLink>
                </div>
              )}
            </div>
          </div>
          <NavLink to="/contactus" 
            className={({ isActive }) => `hover:text-gray-100 ml-4 hover:underline ${isActive ? "text-gray-100 underline" : "text-white"}`}>
              Contact Us
            </NavLink>
            
          {/* Search Bar */}
          <div className="hidden md:flex flex-grow mx-4">
            <input
              type="text"
              placeholder="Search for products"
              className="w-full px-4 py-2 border rounded-full hover:bg-gray-200 duration-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link to={'/addtocart'}>
              <button
                aria-label="Cart"
                className="relative text-white hover:text-gray-100 focus:outline-none"
                onClick={() => setIsCartOpen(true)}
              >
                <i className="fas fa-shopping-cart text-lg"></i>
                {cartQuantity > 0 && (
                  <span className="absolute -top-0 -right-1 bg-blue-600 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartQuantity}
                  </span>
                )}
              </button>
            </Link>

            {/* Login */}
            {/* <Link to={"/login"}>
              <button aria-label="Profile" className="text-white hover:text-gray-100 focus:outline-none">
                <i className="fas fa-user text-lg"></i>
              </button>
            </Link> */}
      <div className="relative">
        {user && user.username ? (
          <>
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              aria-label="User Menu"
              className="w-10 h-10 rounded-full bg-gray-300 text-black flex items-center justify-center"
            >
              <span className="text-lg font-bold uppercase">{user?.username?.[0]}</span>
            </button>
            {userMenuOpen && <UserDropdown user={user} setMenuOpen={setUserMenuOpen} />}
          </>
        ) : (
          <Link to="/login">
            <button aria-label="Profile" className="text-white hover:text-gray-100 focus:outline-none">
              <i className="fas fa-user text-lg"></i>
            </button>
          </Link>
        )}
      </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:text-gray-100 focus:outline-black"
            >
              <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-lg`}></i>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-100">
          <NavLink to='/home' className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>Home</NavLink>
          <NavLink to='/aboutus' className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>About Us</NavLink>
          <NavLink to='/newarrival' className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>New Arrivals</NavLink>

          {/* Shop Dropdown */}
          <div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Shop <i className="fas fa-chevron-down ml-1"></i>
            </button>
            {isDropdownOpen && (
              <div className="ml-4">
                <NavLink to='/men' className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>Men</NavLink>
                <NavLink to='/women' className='block px-4 py-2 text-gray-800 hover:bg-gray-200'>Women</NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;

