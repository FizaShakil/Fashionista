// components/UserDropdown.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/userSlice";
import axiosInstance from '../../axiosInstance'

const UserDropdown = ({ user, setMenuOpen }) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/v1/users/logout", {}, { withCredentials: true });
      confirm("Are you sure want to logout? ")
      dispatch(logout());
      setMenuOpen(false);
    } catch (err) {
      console.error("Logout failed", err);
      alert("Failed to logout")
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md overflow-hidden z-10">
      <div className="p-4 border-b">
        <p className="font-medium">{user.username}</p>
        <p className="text-sm font-bold text-gray-600">{user.email}</p>
      </div>
      <Link to="/addtocart" className="block px-4 py-2 hover:bg-gray-100">
        <i className="fas fa-shopping-cart mr-2"></i>Cart
      </Link>
      <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
        <i className="fas fa-box mr-2"></i>Orders
      </Link>
      <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">
        <i className="fas fa-user mr-2"></i>Account
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
      >
        <i className="fas fa-sign-out-alt mr-2"></i>Logout
      </button>
    </div>
  );
};

export default UserDropdown;
