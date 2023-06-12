import './App.css';
import React from 'react'
import { LoginPage } from './pages/LoginPage';
import { AuthenticationApiClient } from './api_views/AuthenticationApiClient'
import RegisterPage from './pages/RegisterPage';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

export const _authenticationApiClient = new AuthenticationApiClient()

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
