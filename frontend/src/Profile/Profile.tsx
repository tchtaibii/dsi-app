import './Profile.scss';
import { myData } from '../atoms'; // Import the atom defined earlier
import { useRecoilValue } from 'recoil'
import { useEffect } from 'react';
import DefaultPhoto from '../assets/profile.png'


const PhoneSvg = () => (
    <svg style={{
        width: "1.0625rem",
        height: "1.0625rem"
    }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 17 17" fill="none">
        <path d="M3.41889 7.35722C4.77889 10.03 6.97 12.2117 9.64278 13.5811L11.7206 11.5033C11.9756 11.2483 12.3533 11.1633 12.6839 11.2767C13.7417 11.6261 14.8844 11.815 16.0556 11.815C16.575 11.815 17 12.24 17 12.7594V16.0556C17 16.575 16.575 17 16.0556 17C7.18722 17 0 9.81278 0 0.944444C0 0.425 0.425 0 0.944444 0H4.25C4.76944 0 5.19444 0.425 5.19444 0.944444C5.19444 2.125 5.38333 3.25833 5.73278 4.31611C5.83667 4.64667 5.76111 5.015 5.49667 5.27944L3.41889 7.35722Z" fill="#434343" />
    </svg>

)

const Profile = () => {
    const data = useRecoilValue(myData);
    useEffect(() => {
        console.log(data)
    }, [])
    return (
        <div className='ContentMain'>
            <div style={{ justifyContent: "space-between", alignItems: 'center' }} className="header">
                <h1 style={{ textTransform: 'capitalize' }}>{`Profile`}</h1>
            </div>
            <div className="main">
                <div className="mainmain">
                    <div className="cardProfile">
                        <img src={data.avatar ? data.avatar : DefaultPhoto} className="profilePhoto" />
                        <div className='infoText'>
                            <h1 style={{ textTransform: 'capitalize' }}>{`${data.first_name} ${data.last_name}`}</h1>
                            {/* <h3 style={{ textTransform: 'capitalize' }}>{data.proffession}</h3> */}
                            <div className="phoneNumber">
                                <PhoneSvg />
                                {/* {data.mobile} */}
                            </div>
                            <div className="emailP">
                                <PhoneSvg />
                                {data.email}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Profile