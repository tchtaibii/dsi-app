import './App.scss'
import Navbar from './Navbar/Navbar'
import Dashboard from './Dashboard/Dashboard'
import Orders from './Orders/Orders'
import Products from './Products/Products'
import Product from './Product/Product'
import Profile from './Profile/Profile'
import Customer from './Customer/Customer'
import Settings from './Settings/Settings'
import { Routes, Route } from "react-router-dom"

function App() {

  return (
    <>
      <div id='app'>
        <Navbar />
        <div className='underNav'>
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="Profile/id" element={<Profile />} />
              <Route path="Products" element={<Products />} />
              <Route path="Product/:id" element={<Product />} />
              <Route path="Settings" element={<Settings />} />
              <Route path="Orders" element={<Orders />} />
              <Route path="Customer" element={<Customer />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
