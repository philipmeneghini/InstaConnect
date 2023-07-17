import './App.css';
import React from 'react'
import { LoginPage } from './pages/LoginPage';
import { AuthenticationApiClient } from './api_views/AuthenticationApiClient'
import RegisterPage from './pages/RegisterPage';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { UserApiClient } from './api_views/UserApiClient';

export const GUEST_EMAIL = process.env.GUEST_EMAIL!
export const GUEST_PASSWORD = process.env.GUEST_PASSWORD!
export const _authenticationApiClient = new AuthenticationApiClient()
export const _userApiClient = new UserApiClient()

function App() {
  return (
    <div className = "App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;