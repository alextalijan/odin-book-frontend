import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import UserContext from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Check if the user has already logged In

  function login(user) {
    setUser(user);
  }

  function logout() {
    setUser(null);
  }

  // If log in status is being checked, show loading screen
  if (loadingUser)
    return (
      <div className="wrapper">
        <div className="container">
          <span className="logo">Social Media</span>
          <img
            src="/public/loading-icon.png"
            alt="loading icon"
            className="loading-icon"
          />
        </div>
      </div>
    );

  return (
    <UserContext.Provider value={{ user, login }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
