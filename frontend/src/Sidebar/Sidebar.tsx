import { useState } from 'react';
import { NavLink } from "react-router-dom";
import './Sidebar.scss';

const Burger = () => (
    <svg style={{ width: "1.5rem", height: "1.5rem" }} width="2.813rem" height="1.875rem" viewBox="0 0 45 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.137939 29.3333H44.2759V24.4444H0.137939V29.3333ZM0.137939 17.1111H44.2759V12.2222H0.137939V17.1111ZM0.137939 0V4.88889H44.2759V0H0.137939Z" fill="#BABABA" />
    </svg>

)
const DashboardSvg = () => (
    <svg style={{ width: "1.5rem", height: "1.5rem", marginLeft: "0.5rem" }} width="2.4375rem" height="2.5rem" viewBox="0 0 43 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M38.2597 0.5H5.20864C2.61177 0.5 0.487061 2.45 0.487061 4.83333V35.1667C0.487061 37.55 2.61177 39.5 5.20864 39.5H38.2597C40.8566 39.5 42.9813 37.55 42.9813 35.1667V4.83333C42.9813 2.45 40.8566 0.5 38.2597 0.5ZM14.6518 30.8333H9.93022V20H14.6518V30.8333ZM24.095 30.8333H19.3734V24.3333H24.095V30.8333ZM24.095 20H19.3734V15.6667H24.095V20ZM33.5381 30.8333H28.8165V9.16667H33.5381V30.8333Z" fill="#BABABA" />
    </svg>
)
const AchatSvg = () => (
    <svg style={{ width: "1.5rem", height: "1.5rem", marginLeft: "0.5rem" }} width={42} height={33} viewBox="0 0 42 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M27.9991 12.0564L20.4336 0.725455C20.1055 0.241818 19.5527 0 19 0C18.4473 0 17.8945 0.241818 17.5664 0.742727L10.0009 12.0564H1.72727C0.777273 12.0564 0 12.8336 0 13.7836C0 13.9391 0.0172727 14.0945 0.0690908 14.25L4.45636 30.2618C4.85364 31.7127 6.18364 32.7836 7.77273 32.7836H30.2273C31.8164 32.7836 33.1464 31.7127 33.5609 30.2618L37.9482 14.25L38 13.7836C38 12.8336 37.2227 12.0564 36.2727 12.0564H27.9991ZM13.8182 12.0564L19 4.45636L24.1818 12.0564H13.8182ZM19 25.8745C17.1 25.8745 15.5455 24.32 15.5455 22.42C15.5455 20.52 17.1 18.9655 19 18.9655C20.9 18.9655 22.4545 20.52 22.4545 22.42C22.4545 24.32 20.9 25.8745 19 25.8745Z" fill="#BABABA" />
    </svg>
)

const CommandeSvg = () => (
    <svg style={{ width: "1.5rem", height: "1.5rem", marginLeft: "0.5rem" }} width={39} height={35} viewBox="0 0 39 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.7413 28C9.64382 28 7.94677 29.575 7.94677 31.5C7.94677 33.425 9.64382 35 11.7413 35C13.8388 35 15.5549 33.425 15.5549 31.5C15.5549 29.575 13.8388 28 11.7413 28ZM0.300537 0V3.5H4.11412L10.9786 16.7825L8.4044 21.07C8.09932 21.56 7.9277 22.1375 7.9277 22.75C7.9277 24.675 9.64382 26.25 11.7413 26.25H34.6228V22.75H12.5421C12.2752 22.75 12.0654 22.5575 12.0654 22.3125L12.1226 22.1025L13.8388 19.25H28.0444C29.4745 19.25 30.7329 18.5325 31.3812 17.4475L38.2076 6.09C38.3601 5.845 38.4364 5.5475 38.4364 5.25C38.4364 4.2875 37.5783 3.5 36.5296 3.5H8.32813L6.53575 0H0.300537ZM30.8092 28C28.7117 28 27.0147 29.575 27.0147 31.5C27.0147 33.425 28.7117 35 30.8092 35C32.9067 35 34.6228 33.425 34.6228 31.5C34.6228 29.575 32.9067 28 30.8092 28Z" fill="#BABABA" />
    </svg>

)

const CustomerSvg = () => (
    <svg style={{ width: "1.5rem", height: "1.5rem", marginLeft: "0.5rem" }} width={44} height={40} viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.0925 16.6666C26.1042 16.6666 29.3564 13.6818 29.3564 9.99991C29.3564 6.31802 26.1042 3.33325 22.0925 3.33325C18.0807 3.33325 14.8285 6.31802 14.8285 9.99991C14.8285 13.6818 18.0807 16.6666 22.0925 16.6666Z" fill="#BABABA" />
        <path d="M38.4362 36.6667C38.4362 28.3825 31.1187 21.6667 22.0922 21.6667C13.0657 21.6667 5.74829 28.3825 5.74829 36.6667" fill="#BABABA" />
    </svg>

)

const SettingSvg = () => (
    <svg style={{ width: "1.5rem", height: "1.5rem", marginLeft: "0.5rem" }} width={35} height={32} viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30.5507 17.4952C30.623 16.9972 30.6592 16.4826 30.6592 15.9349C30.6592 15.4037 30.623 14.8726 30.5326 14.3746L34.2041 11.752C34.5296 11.5196 34.62 11.0714 34.4211 10.7394L30.9486 5.22863C30.7315 4.86346 30.2794 4.74727 29.8815 4.86346L25.5589 6.45695C24.6546 5.82619 23.6961 5.29503 22.629 4.89666L21.9779 0.680552C21.9056 0.28218 21.5438 0 21.1098 0H14.1647C13.7307 0 13.387 0.28218 13.3147 0.680552L12.6636 4.89666C11.5965 5.29503 10.6199 5.84279 9.73367 6.45695L5.41111 4.86346C5.01322 4.73067 4.56107 4.86346 4.34404 5.22863L0.889607 10.7394C0.672574 11.088 0.744918 11.5196 1.10664 11.752L4.7781 14.3746C4.68767 14.8726 4.61533 15.4203 4.61533 15.9349C4.61533 16.4494 4.6515 16.9972 4.74193 17.4952L1.07047 20.1178C0.744918 20.3502 0.654488 20.7983 0.853435 21.1303L4.32595 26.6411C4.54298 27.0063 4.99513 27.1225 5.39303 27.0063L9.71558 25.4128C10.6199 26.0436 11.5784 26.5747 12.6455 26.9731L13.2966 31.1892C13.387 31.5876 13.7307 31.8698 14.1647 31.8698H21.1098C21.5438 31.8698 21.9056 31.5876 21.9598 31.1892L22.6109 26.9731C23.678 26.5747 24.6546 26.0436 25.5409 25.4128L29.8634 27.0063C30.2613 27.1391 30.7135 27.0063 30.9305 26.6411L34.403 21.1303C34.62 20.7651 34.5296 20.3502 34.186 20.1178L30.5507 17.4952ZM17.6373 21.9105C14.0562 21.9105 11.1263 19.2215 11.1263 15.9349C11.1263 12.6483 14.0562 9.9593 17.6373 9.9593C21.2183 9.9593 24.1482 12.6483 24.1482 15.9349C24.1482 19.2215 21.2183 21.9105 17.6373 21.9105Z" fill="#BABABA" />
    </svg>
)

const LogoutSvg = () => (
    <svg style={{ width: "1.5rem", height: "1.5rem", marginLeft: "0.5rem" }} width={39} height={36} viewBox="0 0 39 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.7263 3H3.38989V33H19.7338" stroke="#7e2f1d" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M27.9059 25.5L36.0778 18L27.9059 10.5" stroke="#7e2f1d" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.4701 17.9932H36.078" stroke="#7e2f1d" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>

)

const Sidebar = () => {

    const [increaseNav, setNav] = useState<boolean>(true)
    const [changeWidth, setWidth] = useState<string>("15rem")
    const [changeWidthC, setWidthC] = useState<string>("100%")
    return (
        <div style={{ width: changeWidth }} className='Sidebar'>
            <div className="top">
                <div onClick={() => {
                    let widthSide;
                    if (!increaseNav) {
                        setWidth("15rem")
                        setWidthC("100%")
                    }
                    else {
                        setWidthC("70%")
                        setWidth("5rem")
                    }
                    setNav((state) => (!state))
                }} className="burger">
                    <Burger />
                </div>
                <ul>
                    <NavLink className={({ isActive }) =>
                        isActive ? 'nav-icon-act' : ''
                    } style={{ width: changeWidthC }} to="/"><DashboardSvg />{increaseNav && "Dashboard"}</NavLink>
                    <NavLink className={({ isActive }) =>
                        isActive ? 'nav-icon-act' : ''
                    } style={{ width: changeWidthC }} to="/achats"><AchatSvg />{increaseNav && "Achats"}</NavLink>
                    <NavLink className={({ isActive }) =>
                        isActive ? 'nav-icon-act' : ''
                    } style={{ width: changeWidthC }} to="/customer"><CustomerSvg />{increaseNav && "Customer"}</NavLink>
                    <NavLink style={{ width: changeWidthC }} to="/commandes"><CommandeSvg />{increaseNav && "Commandes"}</NavLink>
                    <NavLink className={({ isActive }) =>
                        isActive ? 'nav-icon-act' : ''
                    } style={{ width: changeWidthC }} to="/settings"><SettingSvg />{increaseNav && "Settings"}</NavLink>
                </ul>
            </div>
            <div className="top">
                <ul>
                    <a style={{ width: changeWidthC }} href="" className="logout" ><LogoutSvg />{increaseNav && "Log out"}</a>
                </ul>
            </div>
        </div>
    )
}
export default Sidebar