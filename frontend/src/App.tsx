import './App.scss'
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'
import Dashboard from './Dashboard/Dashboard'
import Achats from './Achats/Achats'
import { myData } from './atoms'
import Achat from './Achat/Achat'
import BC from './BC/BC'
// import Commandes from './Commandes/Commandes'
import AddCommande from './AddCommande/AddCommande'
import Progress from './Progress/Progress'
import Affecté from './Affecté/Affecté'
import Stock from './Stock/Stock'
import BcStock from './BcStock/BcStock'
// import Products from './Products/Products'
// import Product from './Product/Product'
import Profile from './Profile/Profile'
import Produit from './Produit/Produit'
// import Customer from './Customer/Customer'
import Settings from './Settings/Settings'
import Login from './Login/Login'
import Loading from './Loading/Loading'
import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from 'react'
import axios from './Interceptor'
import { useRecoilState } from 'recoil';


function App() {

	const [isLogin, setLogin] = useState<boolean>(false);
	const [recoilMyData, setData] = useRecoilState(myData)

	useEffect(() => {
		const fetchData = async () => {
			await axios.get('/auth/my/').then((resp: any) => {
				setLogin(true)
				setData(resp.data);
			}).catch((resp: any) => {
				localStorage.removeItem('access_token');
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
	const [SearchT, setSearch] = useState('')
	return (
		<>
			{
				isLoading ? <Loading /> :
					!isLogin ? <Login setIsLogin={setLogin} /> :
						<div id='app'>
							<Sidebar />
							<div className='underNav'>
								<Navbar setSearch={setSearch} />
								<div className="content">
									<Routes>
										<Route path="/" element={<Dashboard />} />
										{/* <Route path="commandes" element={<Commandes />} /> */}
										{
											recoilMyData.is_achat_manager &&
											<>
												<Route path="achats/:id?" element={<Achats SearchT={SearchT} />} />
												<Route path="achat/:id" element={<Achat />} />
												<Route path="AddCommande" element={<AddCommande />} />
												<Route path="commandes/:id" element={<Progress />} />
											</>
										}
										<Route path="profile" element={<Profile />} />
										<Route path="produit/:id" element={<Produit />} />

										<Route path="Profile/id" element={<Profile />} />
										<Route path="Settings" element={<Settings />} />
										<Route path="stock/:type?" element={<Stock />} />
										<Route path="affecté" element={<Affecté />} />
										<Route path="BC/:id" element={<BC />} />
										<Route path="stocks/:bc/:id" element={<BcStock />} />
										{/* <Route path="Products" element={<Products />} />
										<Route path="Product/:id" element={<Product />} />
										<Route path="Orders" element={<Orders />} /> */}
										{/* <Route path="Achats" element={<Achats />} /> */}
										{/* <Route path="Commandes" element={<Commandes />} /> */}
										{/* <Route path="Customer" element={<Customer />} /> */}
										{/* <Route path="customer" element={<Customer />} /> */}
									</Routes>
								</div>
							</div>
						</div>
			}
		</>
	)
}

export default App
