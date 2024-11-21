import React from 'react'
import LoginHeader from '../../components/login-pages/LoginHeader'
import RegisterForm from '../../components/login-pages/RegisterForm'
import { Paths } from '../../utils/Constants'
import LoginFooter from '../../components/login-pages/LoginFooter'


export const RegisterPage = () => {
    return (
        <div>
            <LoginHeader sideButton='Login' sideButtonPath={Paths['Login']}/>
            <RegisterForm/>
            <LoginFooter/>
        </div>
)}

export default RegisterPage