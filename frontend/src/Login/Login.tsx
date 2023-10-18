import './Login.scss';
import logo from '../assets/logoL.png'
import axios from '../Interceptor'
import { useEffect, useState } from 'react';
import Error from '../Error'


interface Field {
  email: string,
  password: string
}

function Login({ setIsLogin }): { setIsLogin: any } {

  useEffect(() => {

  }, [])

  const [loginField, setLogin] = useState<Field>({
    email: "",
    password: ""
  })
  const [isValid, setIsValid] = useState(false);

  const [statusCode, setStatus] = useState({
    color: "#AF4C4C",
    status: "Failed",
    text: "Wrong Inputs",
    is: false
  })
  useEffect(() => {
    if (statusCode.is) {
      const timer = setTimeout(() => {
        setStatus((state) => ({
          ...state,
          is: false
        }))
      }, 5000)
      return () => clearTimeout(timer);
    }
  }, [statusCode])

  const HandleLogin = async () => {
    if (loginField.email && loginField.email.length > 0 && loginField.password && loginField.password.length > 0 && isValid) {
      try {
        const response = await axios.post('/auth/login/', {
          "email": loginField.email,
          "password": loginField.password
        });
        // Extract the access token from the response
        const accessToken = response.data.access;

        // Set the access token in local storage
        localStorage.setItem('access_token', accessToken);
        setIsLogin(true);
        window.location.reload();

        // Redirect or perform other actions upon successful login
        // For example, you can navigate to another page
        // history.push('/dashboard');
      } catch (error) {
        setStatus({
          color: "#AF4C4C",
          status: "Failed!",
          text: "Wrong Inputs",
          is: true
        })
      }
    }
  }
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      HandleLogin();
    }
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(loginField.email));
  }, [loginField])


  return (
    <div className='Login'>
      {
        statusCode.is &&
        <Error statusCode={statusCode} setStatus={setStatus} />
      }
      <img src={logo} />
      <div style={{ width: '40.1385rem' }} className="inputCommande">
        <div className="label">Email </div>
        <div className="inputText">
          <input onChange={(e: any) => {
            const newD = e.target.value;
            setLogin((state: any) => ({
              ...state,
              email: newD
            }))
          }} placeholder="ex: user@example.com" type="email" name="email" id="email-login" />
        </div>
      </div>
      <div style={{ width: '40.1385rem' }} className="inputCommande">
        <div className="label">Password </div>
        <div className="inputText">
          <input onKeyPress={handleKeyPress} onChange={(e: any) => {
            const newD = e.target.value;
            setLogin((state: any) => ({
              ...state,
              password: newD
            }))
          }} placeholder="Enter your Password" type="password" name="password" id="password-login" />
        </div>
      </div>
      <button onClick={HandleLogin} style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>Login</button>
    </div>
  )
}

export default Login
