import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div>
      <div>
        <div className='flex flex-col text-sm justify-between h-48 list-none ml-8 mt-7 w-44'>
          <ul className="space-y-7 flex flex-col justify-between">
            <NavLink to='/'>
                <li className="font-semibold text-pink-800">
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
                   <i className="fas fa-user"></i> Users-List
                </li>
            </NavLink>
         </ul>
      </div>
      <div>
         
      </div>
      </div>
    </div>
  )
}

export default Sidebar