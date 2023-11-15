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
import Produits from './Produits/Produits'
import Profile from './Profile/Profile'
import Produit from './Produit/Produit'
// import Customer from './Customer/Customer'
import Settings from './Settings/Settings'
import Login from './Login/Login'
import Loading from './Loading/Loading'
import Register from './Register/Register'
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
				console.log(resp.data)
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
										{
											recoilMyData.is_superuser &&
											<>
												<Route path="signup" element={<Register />} />
											</>
										}
										{
											(recoilMyData.is_achat_manager || recoilMyData.is_superuser) &&
											<>
												<Route path="/" element={<Dashboard />} />
												<Route path="achats/:id?" element={<Achats SearchT={SearchT} />} />
												<Route path="achat/:id" element={<Achat />} />
											</>
										}
										{
											recoilMyData.is_achat_manager &&
											<>
												<Route path="AddCommande" element={<AddCommande />} />
												<Route path="commandes/:id" element={<Progress />} />
												<Route path="Settings" element={<Settings />} />
											</>
										}
										{
											(recoilMyData.is_achat_manager || recoilMyData.is_superuser) &&
											<Route path="stocks/:bc/:id" element={<BcStock />} />
										}
										{
											(recoilMyData.is_reception || recoilMyData.agent_affectation) &&
											<>
												<Route path="produit/:id" element={<Produit />} />
												<Route path="/" element={<Dashboard />} />
												<Route path="affecté" element={<Affecté />} />
												<Route path="BC/:id" element={<BC />} />
												<Route path="produits" element={<Produits SearchT={SearchT} />} />
											</>
										}

										<Route path="stock/:type?" element={<Stock />} />

										<Route path="Profile/id" element={<Profile />} />
										<Route path="profile" element={<Profile />} />
									</Routes>
								</div>
							</div>
						</div>
			}
		</>
	)
}

export default App
