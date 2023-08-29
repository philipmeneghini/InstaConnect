import './App.css'
import React from 'react'
import { LoginPage } from './pages/landing-page/LoginPage'
import RegisterPage from './pages/landing-page/RegisterPage'
import SetPasswordPage from './pages/landing-page/SetPasswordPage'
import ResetPasswordPage from './pages/landing-page/ResetPasswordPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Client } from './api/Client'
import HomePage from './pages/home-page/HomePage'
import ProfilePage from './pages/home-page/ProfilePage'

export const _apiClient = new Client(process.env.REACT_APP_API_URL!)

function App() {
  return (
    <div className = 'App'>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/setPassword' element={<SetPasswordPage/>}/>
          <Route path='/resetPassword' element={<ResetPasswordPage/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App
