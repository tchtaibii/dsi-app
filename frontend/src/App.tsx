import './App.scss'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'
import Dashboard from './Dashboard/Dashboard'
import Achats from './Achats/Achats'
import Commandes from './Commandes/Commandes'
import AddCommande from './AddCommande/AddCommande'
import Orders from './Orders/Orders'
import Products from './Products/Products'
import Product from './Product/Product'
import Profile from './Profile/Profile'
import Customer from './Customer/Customer'
import Settings from './Settings/Settings'
import Login from './Login/Login'
import { Routes, Route } from "react-router-dom"
import { useState } from 'react'

function App() {

  const [isLogin, setLogin] = useState<boolean>(true);
  return (
    <>
      {
        !isLogin ? <Login />
          :
          <div id='app'>
            <Sidebar />
            <div className='underNav'>
              <Navbar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="achats" element={<Achats />} />
                  <Route path="commandes" element={<Commandes />} />
                  <Route path="AddCommande" element={<AddCommande />} />
                  {/* <Route path="Profile/id" element={<Profile />} />
              <Route path="Products" element={<Products />} />
              <Route path="Product/:id" element={<Product />} />
              <Route path="Settings" element={<Settings />} />
              <Route path="Orders" element={<Orders />} /> */}

                  {/* <Route path="Achats" element={<Achats />} /> */}
                  {/* <Route path="Commandes" element={<Commandes />} /> */}
                  {/* <Route path="Customer" element={<Customer />} /> */}
                  <Route path="customer" element={<Customer />} />
                </Routes>
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default App
