import React, { useState } from 'react';
import './login.css'
import loginCover from '../assets/climate.png'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    // We can replace this with your authentication logic
    if (username === 'admin' && password === 'password') {
      onLogin(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <div className="formSec">
          <div className="logImg">
              <img src={loginCover} alt="" />
          </div>
          <div className="inputSec">
              <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Username"
                  required
                  />
                  <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  required
                  />
              <button type="submit" className='logBtn'>Login</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
