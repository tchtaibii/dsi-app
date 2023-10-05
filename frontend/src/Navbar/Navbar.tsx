import './Navbar.scss';
import profile from '../assets/profile.png'

const ArrowP = () => (
    <svg style={{ width: "0.875rem", height: "1.44388rem", transform: "rotate(-90deg)"}} width={24} height={15} viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.2587 0.999401L12.1541 10.0995L3.05405 0.994951L0.604601 3.4432L12.1529 14.9972L23.7069 3.44884L21.2587 0.999401Z" fill="#8D8D8D" />
    </svg>

)
const BtnAdd = () => (
    <svg style={{ width: "2.5rem" }} width={55} height={55} viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M27.3728 0.416748C12.376 0.416748 0.20459 12.5501 0.20459 27.5001C0.20459 42.4501 12.376 54.5834 27.3728 54.5834C42.3697 54.5834 54.541 42.4501 54.541 27.5001C54.541 12.5501 42.3697 0.416748 27.3728 0.416748ZM40.9569 30.2084H30.0896V41.0417H24.656V30.2084H13.7887V24.7917H24.656V13.9584H30.0896V24.7917H40.9569V30.2084Z" fill="#E79613" />
    </svg>
)
const Search = () => (
    <svg style={{width: "1.5rem"}} xmlns="http://www.w3.org/2000/svg" width={31} height={31} viewBox="0 0 31 31" fill="none">
        <path d="M22.3427 18.9167H20.9889L20.5091 18.4554C22.1885 16.5079 23.1996 13.9796 23.1996 11.2292C23.1996 5.09625 18.2128 0.125 12.0606 0.125C5.90847 0.125 0.921631 5.09625 0.921631 11.2292C0.921631 17.3621 5.90847 22.3333 12.0606 22.3333C14.8196 22.3333 17.3559 21.3254 19.3095 19.6513L19.7722 20.1296V21.4792L28.3407 30.0038L30.8941 27.4583L22.3427 18.9167ZM12.0606 18.9167C7.79352 18.9167 4.34901 15.4829 4.34901 11.2292C4.34901 6.97542 7.79352 3.54167 12.0606 3.54167C16.3277 3.54167 19.7722 6.97542 19.7722 11.2292C19.7722 15.4829 16.3277 18.9167 12.0606 18.9167Z" fill="#52535C" />
    </svg>

)

const Navbar = () => (
    <div className='Navbar'>
        <div className="navLeft">
            <div style={{cursor: 'pointer',}} className="profileNav">
                <img style={{ width: "2rem", }} src={profile} />
                <p>Imane Hamama</p>
                <ArrowP />
            </div>
            <button style={{cursor: 'pointer',}}>
                <BtnAdd />
            </button>
        </div>
        <div className="search">
            <input type="text" placeholder='Search...' />
            <Search/>
        </div>
    </div>
)
export default Navbar