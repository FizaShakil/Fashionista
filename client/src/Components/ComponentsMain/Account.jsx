import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Heading from "../Reusable-subComponents/Heading";

const Account = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    confirm("Are you sure want to logout? ")
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
        <Heading heading={"Account"}/>
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl hover:shadow-2xl duration-300 rounded-lg text-center">
      {/* Avatar */}
      <div className="mx-auto w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-700 mb-4">
        <i className="fas fa-user-circle text-6xl"></i>
      </div>

      {/* User Info */}
      <h2 className="text-xl font-semibold">{user?.username || "User"}</h2>
      <p className="text-gray-500">{user?.email || "example@mail.com"}</p>

      {/* Edit Button */}
      <button className="mt-2 text-sm text-blue-600 flex items-center justify-center gap-2 hover:underline mx-auto">
        <i className="fas fa-pen"></i>
        Edit
      </button>

      {/* Action Buttons */}
     
      <div className="mt-6 space-y-3">
      <Link to='/myorders'>
        <button className="w-full flex items-center justify-between px-4 py-3 border rounded-md hover:bg-gray-50">
          <span className="flex items-center gap-2">
            <i className="fas fa-box"></i>
            My Orders
          </span>
          <i className="fas fa-chevron-right"></i>
        </button>
        </Link>

      <Link to='/addtocart'>
        <button className="w-full flex items-center justify-between px-4 py-3 border rounded-md hover:bg-gray-50">
          <span className="flex items-center gap-2">
            <i className="fas fa-shopping-cart"></i>
            My Shopping Cart
          </span>
          <i className="fas fa-chevron-right"></i>
        </button>
     </Link>
     
     <Link to='/contactus' >
        <button className="w-full flex items-center justify-between px-4 py-3 border rounded-md hover:bg-gray-50">
          <span className="flex items-center gap-2">
            <i className="fas fa-envelope"></i>
            Need Help? Contact Us
          </span>
          <i className="fas fa-chevron-right"></i>
        </button>
    </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-red-600 hover:bg-red-50"
        >
          <span className="flex items-center gap-2">
            <i className="fas fa-sign-out-alt"></i>
            Log out from this Account
          </span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
    </div>
  );
};

export default Account;
