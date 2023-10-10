import './Login.scss';
import logo from '../assets/logoL.png'
import axios from '../Interceptor'
import { useEffect, useState } from 'react';


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

  const HandleLogin = async () => {
    if (loginField.email && loginField.email.length > 0 && loginField.password && loginField.password.length > 0 && isValid) {
      try {
        const response = await axios.post('http://localhost:8000/auth/login/', {
          "email": loginField.email,
          "password": loginField.password
        });
        // Extract the access token from the response
        const accessToken = response.data.access;

        // Set the access token in local storage
        console.log(response)
        localStorage.setItem('access_token', accessToken);
        setIsLogin(true);

        // Redirect or perform other actions upon successful login
        // For example, you can navigate to another page
        // history.push('/dashboard');
      } catch (error) {
        // Handle login error, e.g., display an error message
        console.error('Login failed:', error);
      }
    }
  }

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(loginField.email));
  }, [loginField])


  return (
    <div className='Login'>
      <img src={logo} />
      <div style={{ width: '46.1385rem' }} className="inputCommande">
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
      <div style={{ width: '46.1385rem' }} className="inputCommande">
        <div className="label">Password </div>
        <div className="inputText">
          <input onChange={(e: any) => {
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
