import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown menu

  return (
    <nav className="bg-gray-950 shadow-md pb-2">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* logo */}
        
        <div className="text-2xl font-bold text-white">
          <Link to='/'>
            Fashionista
          </Link>
            <p className="text-xs font-normal">An ultimate fashion hub for you </p>
        </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex space-x-6 text-white md:ml-8 relative">
                      <NavLink
                                to="/home"
                                    className={({isActive}) =>
                                        `hover:text-gray-100 hover:underline ${isActive ? "text-gray-100 underline" : "text-white no-underline"}`
                                    }
                                >
                                    Home
                       </NavLink>

                       <NavLink
                                to="/aboutus"
                                    className={({isActive}) =>
                                        `hover:text-gray-100 hover:underline ${isActive ? "text-gray-100 underline" : "text-white"}`
                                    }
                                >
                                    About Us
                        </NavLink>

                        <NavLink
                                to="/newarrival"
                                    className={({isActive}) =>
                                        `hover:text-gray-100 hover:underline ${isActive ? "text-gray-100 underline" : "text-white"}`
                                    }
                                >
                                   New Arrivals
                        </NavLink>
            {/* Dropdown for Shop */}
            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
                <span>Shop</span>
                <i className="fas fa-chevron-down text-sm"></i>
              

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-8 left-0 w-40 bg-white shadow-md rounded-md">
                        <NavLink to='/men'
                          className='block px-4 py-2 text-gray-800 hover:bg-gray-200'
                          >
                                  Men
                          </NavLink>
                          <NavLink to='/women'
                          className='block px-4 py-2 text-gray-800 hover:bg-gray-200'
                          >
                                  Women
                          </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-grow mx-4">
            <input
              type="text"
              placeholder="Search for products"
              className="w-full px-4 py-2 border rounded-full hover:bg-gray-200 duration-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-4">
            <button
              aria-label="Cart"
              className="text-white hover:text-gray-100 focus:outline-none"
            >
              <i className="fas fa-shopping-cart text-lg"></i>
            </button>
            <Link to={"/login"}>
            <button
              aria-label="Profile"
              className="text-white hover:text-gray-100 focus:outline-none"
            >
              <i className="fas fa-user text-lg"></i>
            </button>
            </Link>
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
           <NavLink to='/home'
                          className='block px-4 py-2 text-gray-800 hover:bg-gray-200'
                          >
                                  Home
            </NavLink>
            <NavLink to='/aboutus'
                          className='block px-4 py-2 text-gray-800 hover:bg-gray-200'
                          >
                                  About Us
            </NavLink>
            <NavLink to='/newarrival'
                          className='block px-4 py-2 text-gray-800 hover:bg-gray-200'
                          >
                                  New Arrivals
            </NavLink>
          {/* Dropdown for Shop */}
          <div>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Shop <i className="fas fa-chevron-down ml-1"></i>
            </button>
            {isDropdownOpen && (
              <div className="ml-4">
               <NavLink to='/men'
                          className='block px-4 py-2 text-gray-800 hover:bg-gray-200'
                          >
                                  Men
              </NavLink>
              <NavLink to='/women'
                          className='block px-4 py-2 text-gray-800 hover:bg-gray-200'
                          >
                                  Women
            </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
