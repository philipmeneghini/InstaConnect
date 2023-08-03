import './App.css';
import React from 'react'
import { LoginPage } from './pages/LoginPage';
import { AuthenticationApiClient } from './api_views/AuthenticationApiClient'
import RegisterPage from './pages/RegisterPage';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { UserApiClient } from './api_views/UserApiClient';
import SetPasswordPage from './pages/SetPasswordPage';
import { EmailApiClient } from './api_views/EmailApiClient';

export const _authenticationApiClient = new AuthenticationApiClient()
export const _userApiClient = new UserApiClient()
export const _emailApiClient = new EmailApiClient()

function App() {
  return (
    <div className = "App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/setPassword" element={<SetPasswordPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App
