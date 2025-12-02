import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserContext from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Check if the user has already logged In
  useEffect(() => {
    fetch(import.meta.env.VITE_API + '/users/me', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          setUser(json.user);
        }
      })
      .finally(() => setLoadingUser(false));
  }, []);

  function login(user) {
    setUser(user);
  }

  async function logout() {
    await fetch(import.meta.env.VITE_API + '/logout', {
      method: 'POST',
      credentials: 'include',
    });
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
    <UserContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<p>Hello</p>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
