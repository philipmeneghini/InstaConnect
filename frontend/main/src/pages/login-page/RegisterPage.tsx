import React from 'react'
import LoginHeader from '../../components/login-pages/LoginHeader'
import RegisterForm from '../../components/login-pages/RegisterForm'
import { Paths } from '../../utils/Constants'


export const RegisterPage = () => {
    return (
        <div>
            <LoginHeader sideButton='Login' sideButtonPath={Paths['Login']}/>
            <RegisterForm/>
        </div>
)}

export default RegisterPage