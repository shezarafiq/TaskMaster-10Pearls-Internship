// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import SignUpPage from './components/SignUpPage';
// import DashboardPage from './components/DashboardPage'; 
// import ProtectedRoute from './components/ProtectedRoute'; 

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignUpPage />} />

//         {}
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <DashboardPage />
//             </ProtectedRoute>
//           } 
//         />

//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import DashboardPage from './components/DashboardPage';
import UserManagementPage from './components/UserManagementPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './components/ProfilePage'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route 
      path="/profile" 
      element={ <ProtectedRoute><ProfilePage /></ProtectedRoute> } />
      </Routes>
    </Router>
  );
}

export default App;