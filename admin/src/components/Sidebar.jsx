import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axiosInstance from '../axiosInstance'

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      confirm("Are you sure want to logout?")
      await axiosInstance.post('/api/v1/users/logout');
    } catch (e) {}
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className='flex flex-col text-sm justify-between h-60 list-none ml-8 mt-7 w-44'>
          <ul className="space-y-7 flex flex-col justify-between">
            <NavLink to='/dashboard'>
                <li className="font-semibold text-blue-800">
                   <i className="fas fa-tachometer-alt"></i> Dashboard
                 </li>
            </NavLink>
            <NavLink to='/additems'>
                <li className="font-semibold text-gray-700">
                   <i className="fas fa-plus-circle"></i> Add Items
                 </li>
            </NavLink>
            <NavLink to='/itemlist'>
               <li className="text-gray-700">
                   <i className="fas fa-list"></i> List Items
               </li>
            </NavLink>
            <NavLink to='/orders'>
                <li className="text-gray-700">
                   <i className="fas fa-box"></i> Orders
                </li>
            </NavLink>
            <NavLink to='/userslist'>
                <li className="text-gray-700">
                   <i className="fas fa-user"></i> Users List
                </li>
            </NavLink>
         </ul>
      </div>
      </div>
      <div className="mb-8 ml-8">
        <button
          onClick={handleLogout}
          className="w-36 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow font-semibold flex items-center justify-center gap-2"
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar