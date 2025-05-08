import React from 'react'
import Sidebar from './components/Sidebar'
import AddItems from './components/AddItems';
import ItemsList from './components/ItemsList';
import Orders from './components/Orders';
import UsersList from './components/UsersList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="flex ">
        <Sidebar/>

        {/* Vertical divider */}
        <div className="w-px bg-gray-600 h-screen"></div>

        <div className="p-6 w-full">
          <Routes>
            <Route path="/" element={<AddItems />} />
            <Route path="/itemlist" element={<ItemsList/>} />
            <Route path="/orders" element={<Orders />} />
            <Route path='/userslist' element={<UsersList/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App
