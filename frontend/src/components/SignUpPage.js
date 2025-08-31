

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import { FiUserPlus } from 'react-icons/fi';

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 15px 0px rgba(100, 255, 218, 0.4); }
  50% { box-shadow: 0 0 25px 5px rgba(100, 255, 218, 0.6); }
  100% { box-shadow: 0 0 15px 0px rgba(100, 255, 218, 0.4); }
`;

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: black;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  padding: 1rem;

  .form-card1 {
    width: 100%;
    max-width: 450px; // Increased max-width for more fields
    background-image: linear-gradient(163deg, #64ffda 0%, #30d5c8 100%);
    border-radius: 27px;
    transition: all 0.3s;
    padding: 2px;
  }
  .form-card1:hover { box-shadow: 0px 0px 30px 1px rgba(100, 255, 218, 0.5); }
  .form-card2 { background-color: #171717; border-radius: 25px; transition: all 0.2s; }
  .form-card2:hover { transform: scale(0.98); }
  
  .form {
    display: flex; flex-direction: column; gap: 20px;
    padding: 2em; border-radius: 25px;
  }
  
  .icon-container {
    display: flex; justify-content: center; align-items: center;
    margin: 0 auto 20px auto; width: 80px; height: 80px;
    background-color: #171717; border-radius: 50%;
    border: 2px solid #64ffda;
    animation: ${pulseGlow} 3s infinite ease-in-out;
  }
  .icon { font-size: 2.5em; color: #64ffda; }

  .form-heading {
    text-align: center; margin: 0 0 0.5em 0; color: #ccd6f6;
    font-size: 1.5em; font-weight: 500;
  }
  
  .form-field { position: relative; }

  .input-field {
    background: transparent; border: 1px solid #444; outline: none;
    width: 100%; color: #ccd6f6; border-radius: 10px;
    transition: border-color 0.3s ease; padding: 1em; box-sizing: border-box;
    -webkit-appearance: none; // Fix for iOS styling
  }
  select.input-field {
    cursor: pointer;
  }
  select.input-field:invalid {
    color: #8892b0; // Style for the placeholder option
  }

  .input-label {
    position: absolute; pointer-events: none; transform-origin: left;
    transition: all 0.3s ease; color: #8892b0;
    left: 1em; top: 50%; transform: translateY(-50%);
  }

  .input-field:focus { border-color: #64ffda; }

  .input-field:focus + .input-label,
  .input-field:not(:placeholder-shown) + .input-label,
  select.input-field:not([value=""]) + .input-label { // Handles the select label
    top: 0; transform: translateY(-50%) scale(0.85);
    color: #64ffda; background-color: #171717; padding: 0 0.4em;
  }

  .error-text {
    color: #ff7b7b; font-size: 0.8em; text-align: left;
    margin-top: -15px; margin-left: 15px; height: 1em;
  }
  
  .submit-btn {
    cursor: pointer; padding: 1em; border-radius: 10px; border: none;
    font-size: 1em; background-color: transparent; color: #64ffda;
    font-weight: bold; outline: 2px solid #64ffda; transition: all 0.3s ease;
  }
  .submit-btn:hover { background-color: #64ffda1a; box-shadow: 0 0 10px 0 #64ffda; }

  .signin-link { text-align: center; margin-top: 1em; }
  .signin-link a { color: #8892b0; text-decoration: none; font-size: 0.9em; }
  .signin-link a:hover { color: #64ffda; text-decoration: underline; }
  
  .name-container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
`;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.firstName = formData.firstName ? "" : "First Name is required.";
    tempErrors.lastName = formData.lastName ? "" : "Last Name is required.";
    tempErrors.username = formData.username ? "" : "Username is required.";
    const emailRegex = /\S+@\S+\.\S+/;
    tempErrors.email = emailRegex.test(formData.email) ? "" : "Email is not valid.";
    tempErrors.password = formData.password.length >= 8 ? "" : "Password must be >= 8 characters.";
    tempErrors.confirmPassword = formData.password === formData.confirmPassword ? "" : "Passwords do not match.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await axios.post('http://localhost:5209/api/auth/register', dataToSend);
      alert('Registration Successful! Please log in.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      console.error('Registration failed:', errorMessage);
      setErrors(prevErrors => ({ ...prevErrors, server: errorMessage }));
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <StyledWrapper>
      <div className="form-card1">
        <div className="form-card2">
          <form className="form" onSubmit={handleSubmit} noValidate>
            
            <div className="icon-container">
              <FiUserPlus className="icon" />
            </div>

            <p className="form-heading">Create Your Account</p>

            <div className='name-container'>
                <div className="form-field">
                    <input id="firstName" name="firstName" className="input-field" type="text" value={formData.firstName} onChange={handleInputChange} placeholder=" " />
                    <label htmlFor="firstName" className="input-label">First Name</label>
                </div>
                <div className="form-field">
                    <input id="lastName" name="lastName" className="input-field" type="text" value={formData.lastName} onChange={handleInputChange} placeholder=" " />
                    <label htmlFor="lastName" className="input-label">Last Name</label>
                </div>
            </div>
            <div className="error-text">{errors.firstName || errors.lastName || ''}</div>

            <div className="form-field">
                <input id="username" name="username" className="input-field" type="text" value={formData.username} onChange={handleInputChange} placeholder=" " />
                <label htmlFor="username" className="input-label">Username</label>
            </div>
            <div className="error-text">{errors.username || ''}</div>
            
            <div className="form-field">
                <input id="email" name="email" className="input-field" type="email" value={formData.email} onChange={handleInputChange} placeholder=" " />
                <label htmlFor="email" className="input-label">Email Address</label>
            </div>
            <div className="error-text">{errors.email || ''}</div>
            
            <div className="form-field">
                <select id="gender" name="gender" className="input-field" value={formData.gender} onChange={handleInputChange} required>
                    <option value="" disabled hidden></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <label htmlFor="gender" className="input-label">Gender (Optional)</label>
            </div>
             <div className="error-text">{/* Placeholder for gender error if needed */}</div>

            <div className="form-field">
                <input id="password" name="password" className="input-field" type="password" value={formData.password} onChange={handleInputChange} placeholder=" " />
                <label htmlFor="password" className="input-label">Password</label>
            </div>
            <div className="error-text">{errors.password || ''}</div>

            <div className="form-field">
                <input id="confirmPassword" name="confirmPassword" className="input-field" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder=" " />
                <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            </div>
            <div className="error-text">{errors.confirmPassword || errors.server || ''}</div>

            <button type="submit" className="submit-btn">Sign Up</button>

            <div className="signin-link">
              <Link to="/login">{"Already have an account? Sign In"}</Link>
            </div>
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default SignUpPage;