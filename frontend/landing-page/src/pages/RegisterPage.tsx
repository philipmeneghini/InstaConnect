import React from 'react'
import { _authenticationApiClient } from '../App'
import LoginHeader from '../components/LoginHeader'
import RegisterForm from '../components/RegisterForm'

export const RegisterPage = () => {
    return (
      <div>
        <LoginHeader />
        <RegisterForm/>
      </div>)
}

export default RegisterPage