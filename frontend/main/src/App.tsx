import './App.css'
import React from 'react'
import { LoginPage } from './pages/login-page/LoginPage'
import RegisterPage from './pages/login-page/RegisterPage'
import SetPasswordPage from './pages/login-page/SetPasswordPage'
import ResetPasswordPage from './pages/login-page/ResetPasswordPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Client } from './api/Client'
import HomePage from './pages/main-page/HomePage'
import ProfilePage from './pages/main-page/ProfilePage'
import NotificationProvider from './components/NotificationProvider'

export const _apiClient = new Client(process.env.REACT_APP_API_URL!)

function App() {
  return (
    <div className = 'App'>
      <NotificationProvider>
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
      </NotificationProvider>
    </div>
  )
}

export default App
