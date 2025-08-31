

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
 
import backgroundImage from '../assets/images/task_bg.jpg'; 

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 15px 0px rgba(167, 139, 250, 0.4);
  }
  50% {
    box-shadow: 0 0 25px 5px rgba(167, 139, 250, 0.6);
  }
  100% {
    box-shadow: 0 0 15px 0px rgba(167, 139, 250, 0.4);
  }
`;


const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* --- ADD YOUR BACKGROUND IMAGE WITH AN OVERLAY --- */
  /* This creates a dark, 60% transparent layer on top of your image */
  /*background-image: linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.85)), url(${backgroundImage});*/
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color:black;
  /* --------------------------------------------------- */

  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  padding: 1rem;
  

  /* --- RE-INTRODUCED: Hover animation wrapper divs --- */
  .form-card1 {
    width: 100%;
    max-width: 412px; /* A bit larger to accommodate padding */
    background-image: linear-gradient(163deg, #a78bfa 0%, #7c3aed 100%);
    border-radius: 27px; /* Outer border radius */
    transition: all 0.3s;
    padding: 2px; /* This creates the border effect */
  }

  .form-card1:hover {
    box-shadow: 0px 0px 30px 1px rgba(167, 139, 250, 0.5);
  }

  .form-card2 {
    background-color: #171717; /* The inner background color */
    border-radius: 25px; /* Inner border radius, matches the form */
    transition: all 0.2s;
  }
  
  /* The form itself, now sits inside form-card2 */
  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 2em;
    border-radius: 25px;
    /* No background needed here, it inherits from form-card2 */
  }

  .form-card2:hover {
    transform: scale(0.98);
  }
  /* ---------------------------------------------------- */

  
  .lock-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-bottom: 20px;
    width: 80px;
    height: 80px;
    background-color: #171717;
    border-radius: 50%;
    border: 2px solid #a78bfa;
    animation: ${pulseGlow} 3s infinite ease-in-out;
    transition: all .3s ease;
  }

  .lock-icon {
    font-size: 2.5em;
    color: #a78bfa;
    transition: all .3s ease;
  }

  .form-heading {
    text-align: center;
    margin: 0;
    margin-bottom: 0.5em;
    color: #ccd6f6;
    font-size: 1.5em;
    font-weight: 500;
    transition: all .3s ease;
  }
  
  .form-field {
    position: relative;
  }

  .input-field {
    background: transparent;
    border: 1px solid #444;
    outline: none;
    width: 100%;
    color: #ccd6f6;
    border-radius: 10px;
    transition: border-color 0.3s ease;
    padding: 1em; 
    box-sizing: border-box;
  }

  .input-label {
    position: absolute;
    pointer-events: none;
    transform-origin: left;
    transition: all 0.3s ease;
    color: #8892b0;
    left: 1em;
    top: 50%;
    transform: translateY(-50%);
  }

  .input-field:focus {
    border-color: #a78bfa;
  }

  .input-field:focus + .input-label,
  .input-field:not(:placeholder-shown) + .input-label {
    top: 0; 
    transform: translateY(-50%) scale(0.85);
    color: #a78bfa;
    background-color: #171717; 
    padding: 0 0.4em;
  }

  .error-text {
    color: #ff7b7b;
    font-size: 0.8em;
    text-align: left;
    margin-top: -15px;
    margin-left: 15px;
  }
  
  .sendMessage-btn {
    cursor: pointer;
    padding: 1em;
    border-radius: 10px;
    border: none;
    font-size: 1em;
    background-color: transparent;
    color: #a78bfa;
    font-weight: bold;
    outline: 2px solid #a78bfa;
    transition: all 0.3s ease;
  }

  .sendMessage-btn:hover {
    background-color: #a78bfa1a;
    box-shadow: 0 0 10px 0 #a78bfa;
  }

  .signup-link {
    text-align: center;
    margin-top: 1em;
  }

  .signup-link a {
    color: #8892b0;
    text-decoration: none;
    font-size: 0.9em;
  }

  .signup-link a:hover {
    color: #a78bfa;
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    .form {
      padding: 1.5em;
      gap: 15px;
    }

    .lock-icon-container {
      width: 60px;
      height: 60px;
      margin-bottom: 15px;
    }

    .lock-icon {
      font-size: 2em;
    }

    .form-heading {
      font-size: 1.3em;
    }
  }
    .eye-icon {
    position: absolute;
    top: 50%;
    right: 1em;
    transform: translateY(-50%);
    cursor: pointer;
    color: #8892b0;
    transition: color 0.3s ease;
  }

  .eye-icon:hover {
    color: #a78bfa;
  }
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Username is required.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post('http://localhost:5209/api/auth/login', {
        username: username,
        password: password,
      });

      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 401) {
        setPasswordError('Invalid username or password.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };


  return (
    <StyledWrapper>
      <div className="form-card1">
        <div className="form-card2">
          <form className="form" onSubmit={handleSubmit} noValidate>
            
            <div className="lock-icon-container">
              <FiLock className="lock-icon" />
            </div>

            <p className="form-heading">Sign In</p>

            <div className="form-field">
              <input
                id="username"
                className="input-field"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=" "
              />
              <label htmlFor="username" className="input-label">Username</label>
            </div>
            {usernameError && <p className="error-text">{usernameError}</p>}
            
          <div className="form-field">
  <input
    id="password"
    className="input-field"
    type={showPassword ? 'text' : 'password'} 
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder=" "
  />
  <label htmlFor="password" className="input-label">Password</label>
  
  {/* Add the clickable eye icon */}
  <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? <FiEye /> : < FiEyeOff />}
  </span>
</div>
            {passwordError && <p className="error-text">{passwordError}</p>}

            <button type="submit" className="sendMessage-btn">Sign In</button>

            <div className="signup-link">
              <a href="/signup">{"Don't have an account? Sign Up"}</a>
            </div>
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default LoginPage;