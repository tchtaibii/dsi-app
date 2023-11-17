import './Navbar.scss';
import profile from '../assets/profile.png'
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'
import { useRecoilValue } from 'recoil';
import { myData } from '../atoms'
import { useEffect, useState } from 'react'

const ArrowP = () => (
    <svg style={{ width: "0.875rem", height: "1.44388rem", transform: "rotate(-90deg)" }} width={24} height={15} viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.2587 0.999401L12.1541 10.0995L3.05405 0.994951L0.604601 3.4432L12.1529 14.9972L23.7069 3.44884L21.2587 0.999401Z" fill="#8D8D8D" />
    </svg>

)
const BtnAdd = () => (
    <svg style={{ width: "2.5rem" }} width={55} height={55} viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28.3145 0.416748C13.1547 0.416748 0.851074 12.5501 0.851074 27.5001C0.851074 42.4501 13.1547 54.5834 28.3145 54.5834C43.4743 54.5834 55.7779 42.4501 55.7779 27.5001C55.7779 12.5501 43.4743 0.416748 28.3145 0.416748ZM42.0462 30.2084H31.0608V41.0417H25.5681V30.2084H14.5828V24.7917H25.5681V13.9584H31.0608V24.7917H42.0462V30.2084Z" fill="#FFFF" />
    </svg>

)
const Search = () => (
    <svg style={{ width: "1.5rem", cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width={31} height={31} viewBox="0 0 31 31" fill="none">
        <path d="M22.3427 18.9167H20.9889L20.5091 18.4554C22.1885 16.5079 23.1996 13.9796 23.1996 11.2292C23.1996 5.09625 18.2128 0.125 12.0606 0.125C5.90847 0.125 0.921631 5.09625 0.921631 11.2292C0.921631 17.3621 5.90847 22.3333 12.0606 22.3333C14.8196 22.3333 17.3559 21.3254 19.3095 19.6513L19.7722 20.1296V21.4792L28.3407 30.0038L30.8941 27.4583L22.3427 18.9167ZM12.0606 18.9167C7.79352 18.9167 4.34901 15.4829 4.34901 11.2292C4.34901 6.97542 7.79352 3.54167 12.0606 3.54167C16.3277 3.54167 19.7722 6.97542 19.7722 11.2292C19.7722 15.4829 16.3277 18.9167 12.0606 18.9167Z" fill="#52535C" />
    </svg>

)



const Navbar = ({ setSearch }) => {
    const data = useRecoilValue(myData)
    const navigate = useNavigate();

    const [testSerach, setSearchTest] = useState('')

    const handleClick = () => {

        if (data.is_achat_manager && window.location.pathname !== '/achats') {
            navigate('/achats');
        }
        if (data.is_reception && window.location.pathname !== '/produits') {
            navigate('/produits');
        }
    };
    useEffect(() => {
        console.log(data)
    }, [])
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearch(testSerach);
        }
    };

    return (
        <div className='Navbar'>
            <div className="navLeft">
                <div onClick={() => {
                    navigate('/profile');
                }} style={{ cursor: 'pointer', }} className="profileNav">
                    <img style={{ width: "2rem", borderRadius: "0.625rem" }} src={data.avatar ? data.avatar : profile} />
                    <p>{`${data.first_name} ${data.last_name}`}</p>
                    <ArrowP />
                </div>
                {
                    data.is_achat_manager &&
                    <Link to='/AddCommande' style={{ cursor: 'pointer' }}>
                        <BtnAdd />
                    </Link>
                }

            </div>
            <div className="search">
                <input onKeyPress={handleKeyPress} onClick={handleClick} onChange={(e: any) => {
                    const value = e.target.value;
                    setSearchTest(value)

                }} type="text" placeholder='Search...' />
                <div onClick={handleKeyPress}>
                    <Search />
                </div>
            </div>
            <img src={logo} />
        </div>
    )
}
export default Navbar