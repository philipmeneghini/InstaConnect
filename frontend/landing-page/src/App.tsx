import './App.css';
import React from 'react'
import { LoginPage } from './pages/LoginPage';
import { AuthenticationApiClient } from './api_views/AuthenticationApiClient'

export const _authenticationApiClient = new AuthenticationApiClient()

function App() {
  return (
    <div className = "App">
      <LoginPage/>
    </div>
  );
}

export default App;
