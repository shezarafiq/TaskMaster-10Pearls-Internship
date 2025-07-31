// import React, { useState } from 'react';
// import { Box, Typography, TextField, Button, Grid, Link, Avatar, Paper, CssBaseline } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import axios from 'axios';

// const SignUpPage = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     let tempErrors = {};
//     tempErrors.username = username ? "" : "Username is required.";
    
//     const emailRegex = /\S+@\S+\.\S+/;
//     tempErrors.email = emailRegex.test(email) ? "" : "Email is not valid.";
    
//     tempErrors.password = password.length >= 8 ? "" : "Password must be at least 8 characters long.";
    
//     tempErrors.confirmPassword = password === confirmPassword ? "" : "Passwords do not match.";

//     setErrors(tempErrors);

//     return Object.values(tempErrors).every(x => x === "");
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!validate()) return; 

//     try {
//       const response = await axios.post('http://localhost:5209/api/auth/register', {
//         username: username,
//         email: email,
//         password: password,
//       });

//       console.log('Registration successful:', response.data);
//       alert('Registration Successful! Please navigate to the login page.');
      

//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
//       console.error('Registration failed:', errorMessage);
//       setErrors(prevErrors => ({...prevErrors, username: errorMessage}));
//       alert(`Registration failed: ${errorMessage}`);
//     }
//   };

//   return (
//     <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))' }}>
//       <CssBaseline />
//       <Paper elevation={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, maxWidth: 400, width: '100%', gap: 2 }}>
//         <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//           <LockOutlinedIcon />
//         </Avatar>
//         <Typography component="h1" variant="h5">
//           Sign Up
//         </Typography>
//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="username"
//             label="Username"
//             name="username"
//             autoComplete="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             error={!!errors.username}
//             helperText={errors.username}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             error={!!errors.email}
//             helperText={errors.email}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             autoComplete="new-password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             error={!!errors.password}
//             helperText={errors.password}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="confirmPassword"
//             label="Confirm Password"
//             type="password"
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             error={!!errors.confirmPassword}
//             helperText={errors.confirmPassword}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Sign Up
//           </Button>
//           <Grid container justifyContent="flex-end">
//             <Grid item>
//               <Link href="/login" variant="body2">
//                 {"Already have an account? Sign In"}
//               </Link>
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default SignUpPage;


import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { FiLock } from 'react-icons/fi';

// --- IMPORTANT ---
// Make sure your background image is correctly placed in src/assets/images/
// The import path below assumes SignUpPage.js is in src/components/
import backgroundImage from '../assets/images/bg_image3.png'; 

// Keyframes animation for icon glow (Same as Login Page)
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 15px 0px rgba(100, 255, 218, 0.4);
  }
  50% {
    box-shadow: 0 0 25px 5px rgba(100, 255, 218, 0.6);
  }
  100% {
    box-shadow: 0 0 15px 0px rgba(100, 255, 218, 0.4);
  }
`;

// STYLING - This is identical to LoginPage.js for consistency
const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /*background-image: linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.85)), url(${backgroundImage});*/
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color:black;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  padding: 1rem;

  .form-card1 {
    width: 100%;
    max-width: 412px;
    background-image: linear-gradient(163deg, #64ffda 0%, #30d5c8 100%);
    border-radius: 27px;
    transition: all 0.3s;
    padding: 2px;
  }

  .form-card1:hover {
    box-shadow: 0px 0px 30px 1px rgba(100, 255, 218, 0.5);
  }

  .form-card2 {
    background-color: #171717;
    border-radius: 25px;
    transition: all 0.2s;
  }
  
  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 2em;
    border-radius: 25px;
  }

  .form-card2:hover {
    transform: scale(0.98);
  }
  
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
    border: 2px solid #64ffda;
    animation: ${pulseGlow} 3s infinite ease-in-out;
    transition: all .3s ease;
  }

  .lock-icon {
    font-size: 2.5em;
    color: #64ffda;
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
    border-color: #64ffda;
  }

  .input-field:focus + .input-label,
  .input-field:not(:placeholder-shown) + .input-label {
    top: 0; 
    transform: translateY(-50%) scale(0.85);
    color: #64ffda;
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
    color: #64ffda;
    font-weight: bold;
    outline: 2px solid #64ffda;
    transition: all 0.3s ease;
  }

  .sendMessage-btn:hover {
    background-color: #64ffda1a;
    box-shadow: 0 0 10px 0 #64ffda;
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
    color: #64ffda;
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    .form {
      padding: 1.5em;
      gap: 15px;
    }
  }
`;

const SignUpPage = () => {
  // === YOUR SIGN-UP FUNCTIONALITY (UNCHANGED) ===
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = username ? "" : "Username is required.";
    
    const emailRegex = /\S+@\S+\.\S+/;
    tempErrors.email = emailRegex.test(email) ? "" : "Email is not valid.";
    
    tempErrors.password = password.length >= 8 ? "" : "Password must be at least 8 characters long.";
    
    tempErrors.confirmPassword = password === confirmPassword ? "" : "Passwords do not match.";

    setErrors(tempErrors);

    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return; 

    try {
      const response = await axios.post('http://localhost:5209/api/auth/register', {
        username: username,
        email: email,
        password: password,
      });

      console.log('Registration successful:', response.data);
      alert('Registration Successful! Please navigate to the login page.');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
      console.error('Registration failed:', errorMessage);
      // This logic helps display server-side errors (like 'username already taken')
      setErrors(prevErrors => ({...prevErrors, username: errorMessage})); 
      alert(`Registration failed: ${errorMessage}`);
    }
  };
  // === END OF YOUR FUNCTIONALITY ===


  // === NEW JSX USING THE LOGIN PAGE'S DESIGN ===
  return (
    <StyledWrapper>
      <div className="form-card1">
        <div className="form-card2">
          <form className="form" onSubmit={handleSubmit} noValidate>
            
            <div className="lock-icon-container">
              <FiLock className="lock-icon" />
            </div>

            <p className="form-heading">Sign Up</p>

            {/* Username Field */}
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
            {errors.username && <p className="error-text">{errors.username}</p>}
            
            {/* Email Field */}
            <div className="form-field">
              <input
                id="email"
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
              />
              <label htmlFor="email" className="input-label">Email Address</label>
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}

            {/* Password Field */}
            <div className="form-field">
              <input
                id="password"
                className="input-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
              />
              <label htmlFor="password" className="input-label">Password</label>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}

            {/* Confirm Password Field */}
            <div className="form-field">
              <input
                id="confirmPassword"
                className="input-field"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
              />
              <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

            <button type="submit" className="sendMessage-btn">Sign Up</button>

            <div className="signup-link">
              <a href="/login">{"Already have an account? Sign In"}</a>
            </div>
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default SignUpPage;