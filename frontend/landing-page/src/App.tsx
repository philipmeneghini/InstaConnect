import './App.css'
import React from 'react'
import { LoginPage } from './pages/LoginPage'
import { AuthenticationApiClient } from './api_views/AuthenticationApiClient'
import RegisterPage from './pages/RegisterPage'
import SetPasswordPage from './pages/SetPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { UserApiClient } from './api_views/UserApiClient'
import { EmailApiClient } from './api_views/EmailApiClient'
import { Client } from './api/Client'

export const _authenticationApiClient = new AuthenticationApiClient()
export const _userApiClient = new UserApiClient()
export const _emailApiClient = new EmailApiClient()
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
        </Routes>
      </Router>
    </div>
  );
}

export default App
