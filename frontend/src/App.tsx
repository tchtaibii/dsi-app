import './App.scss'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'
import Dashboard from './Dashboard/Dashboard'
import Achats from './Achats/Achats'
import Commandes from './Commandes/Commandes'
import AddCommande from './AddCommande/AddCommande'
// import Orders from './Orders/Orders'
// import Products from './Products/Products'
// import Product from './Product/Product'
// import Profile from './Profile/Profile'
import Customer from './Customer/Customer'
// import Settings from './Settings/Settings'
import Login from './Login/Login'
import Loading from './Loading/Loading'
import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from 'react'
import axios from './Interceptor'
import { useRecoilState } from 'recoil';
import { myData } from './atoms'; // Import the atom defined earlier

function App() {

  const [isLogin, setLogin] = useState<boolean>(false);
  const [recoilMyData, setData] = useRecoilState(myData)

  useEffect(() => {
    const fetchData = async () => {
      await axios.get('/auth/my/').then((resp: any) => {
        setLogin(true)
        setData(resp.data);
        console.log(recoilMyData);
      }).catch((resp: any) => {
        console.log('access: ', localStorage.getItem('access_token'))
        localStorage.removeItem('access_token');
        console.log(resp);
      })
    }
    fetchData();
  }, [isLogin])
  const [isLoading, setloading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setloading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {
        isLoading ? <Loading /> :
          !isLogin ? <Login setIsLogin={setLogin} /> :
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
