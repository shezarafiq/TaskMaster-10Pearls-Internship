// import React, { useState } from 'react';
// import { Box, Typography, TextField, Button, Grid, Link, Avatar, Paper, CssBaseline } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import axios from 'axios';

// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [usernameError, setUsernameError] = useState('');
//   const [passwordError, setPasswordError] = useState('');

//   const validate = () => {
//     let isValid = true;
//     setUsernameError('');
//     setPasswordError('');

//     if (!username.trim()) {
//       setUsernameError('Username is required.');
//       isValid = false;
//     }

//     if (!password) {
//       setPasswordError('Password is required.');
//       isValid = false;
//     }
//     return isValid;
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!validate()) return; 

//     try {
//       const response = await axios.post('http://localhost:5209/api/auth/login', {
//         username: username,
//         password: password,
//       });

//       console.log('Login successful:', response.data);
//       localStorage.setItem('token', response.data.token); 
//       window.location.href = '/dashboard';
//     } catch (error) {
//       console.error('Login failed:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         setPasswordError('Invalid username or password.');
//       } else {
//         alert('An unexpected error occurred. Please try again.');
//       }
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
//           Sign in
//         </Typography>
//         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="username"
//             label="Username"
//             name="username"
//             autoFocus
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             error={!!usernameError}
//             helperText={usernameError}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             error={!!passwordError}
//             helperText={passwordError}
//           />
//           <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
//             Sign In
//           </Button>
//           <Grid container justifyContent="flex-end">
//             <Grid item>
//               <Link href="/signup" variant="body2">
//                 {"Don't have an account? Sign Up"}
//               </Link>
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default LoginPage;

//without icons

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import axios from 'axios';

// // The new styled-component wrapper. I've added styles for error messages and the sign-up link.
// const StyledWrapper = styled.div`
//   /* This ensures the form is centered on the page, similar to your original Box component */
//   min-height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: #0a192f; /* A dark background that fits the theme */

//   .form {
//     display: flex;
//     flex-direction: column;
//     align-self: center;
//     font-family: inherit;
//     gap: 10px;
//     padding-inline: 2em;
//     padding-bottom: 0.4em;
//     background-color: #171717;
//     border-radius: 20px;
//     width: 350px; /* Added a fixed width for better layout */
//   }

//   .form-heading {
//     text-align: center;
//     margin: 2em;
//     color: #64ffda;
//     font-size: 1.2em;
//     background-color: transparent;
//     align-self: center;
//   }

//   .form-field {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 0.5em;
//     border-radius: 10px;
//     padding: 0.6em;
//     border: none;
//     outline: none;
//     color: white;
//     background-color: #171717;
//     box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
//   }

//   /* Style for error text below the input fields */
//   .error-text {
//     color: #ff7b7b;
//     font-size: 0.8em;
//     text-align: left;
//     margin: -5px 0 10px 15px; /* Adjust positioning */
//   }

//   .input-field {
//     background: none;
//     border: none;
//     outline: none;
//     width: 100%;
//     color: #ccd6f6;
//     padding-inline: 1em;
//   }

//   .sendMessage-btn {
//     cursor: pointer;
//     margin-top: 1em; /* Adjusted margin */
//     margin-bottom: 1.5em; /* Adjusted margin */
//     padding: 1em;
//     border-radius: 10px;
//     border: none;
//     outline: none;
//     background-color: transparent;
//     color: #64ffda;
//     font-weight: bold;
//     outline: 1px solid #64ffda;
//     transition: all ease-in-out 0.3s;
//   }

//   .sendMessage-btn:hover {
//     transition: all ease-in-out 0.3s;
//     background-color: #64ffda;
//     color: #000;
//     cursor: pointer;
//     box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
//   }
  
//   /* Link for navigating to the Sign Up page */
//   .signup-link {
//     text-align: center;
//     margin-bottom: 2em;
//   }

//   .signup-link a {
//     color: #ccd6f6;
//     text-decoration: none;
//     font-size: 0.9em;
//   }

//   .signup-link a:hover {
//     color: #64ffda;
//     text-decoration: underline;
//   }


//   .form-card1 {
//     background-image: linear-gradient(163deg, #64ffda 0%, #64ffda 100%);
//     border-radius: 22px;
//     transition: all 0.3s;
//   }

//   .form-card1:hover {
//     box-shadow: 0px 0px 30px 1px rgba(100, 255, 218, 0.3);
//   }

//   .form-card2 {
//     border-radius: 0;
//     transition: all 0.2s;
//   }

//   .form-card2:hover {
//     transform: scale(0.98);
//     border-radius: 20px;
//   }
// `;

// const LoginPage = () => {
//   // === YOUR FUNCTIONALITY (UNCHANGED) ===
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [usernameError, setUsernameError] = useState('');
//   const [passwordError, setPasswordError] = useState('');

//   const validate = () => {
//     let isValid = true;
//     setUsernameError('');
//     setPasswordError('');

//     if (!username.trim()) {
//       setUsernameError('Username is required.');
//       isValid = false;
//     }

//     if (!password) {
//       setPasswordError('Password is required.');
//       isValid = false;
//     }
//     return isValid;
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!validate()) return;

//     try {
//       const response = await axios.post('http://localhost:5209/api/auth/login', {
//         username: username,
//         password: password,
//       });

//       console.log('Login successful:', response.data);
//       localStorage.setItem('token', response.data.token);
//       window.location.href = '/dashboard';
//     } catch (error) {
//       console.error('Login failed:', error.response ? error.response.data : error.message);
//       if (error.response && error.response.status === 401) {
//         setPasswordError('Invalid username or password.');
//       } else {
//         alert('An unexpected error occurred. Please try again.');
//       }
//     }
//   };
//   // === END OF YOUR FUNCTIONALITY ===


//   // === YOUR NEW JSX WITH PRESERVED FUNCTIONALITY ===
//   return (
//     <StyledWrapper>
//       <div className="form-card1">
//         <div className="form-card2">
//           <form className="form" onSubmit={handleSubmit}>
//             <p className="form-heading">Sign In</p>

//             {/* Username Field */}
//             <div className="form-field">
//               <input
//                 required
//                 placeholder="Username"
//                 className="input-field"
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//             {usernameError && <p className="error-text">{usernameError}</p>}
            
//             {/* Password Field */}
//             <div className="form-field">
//               <input
//                 required
//                 placeholder="Password"
//                 className="input-field"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             {passwordError && <p className="error-text">{passwordError}</p>}

//             {/* Submit Button */}
//             <button type="submit" className="sendMessage-btn">Sign In</button>

//             {/* Sign Up Link */}
//             <div className="signup-link">
//               <a href="/signup">{"Don't have an account? Sign Up"}</a>
//             </div>
//           </form>
//         </div>
//       </div>
//     </StyledWrapper>
//   );
// };

// export default LoginPage;

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { FiLock } from 'react-icons/fi';
// import backgroundImage from '../assets/images/bg_image.png'; 
import backgroundImage from '../assets/images/bg_image3.png'; 

// Animation for the icon's glow (Unchanged)
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

// Styled Component with ALL features restored and working together
// const StyledWrapper = styled.div`
//   min-height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: #0a192f;
//   font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
//   padding: 1rem;
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
`;

const LoginPage = () => {
  // === YOUR FUNCTIONALITY (UNCHANGED) ===
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
  // === END OF YOUR FUNCTIONALITY ===


  // === JSX WITH HOVER EFFECT DIVS RESTORED ===
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
              />
              <label htmlFor="password" className="input-label">Password</label>
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