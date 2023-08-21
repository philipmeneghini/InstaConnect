import React from 'react'
import LoginHeader from '../../components/landing-page/LoginHeader'
import RegisterForm from '../../components/landing-page/RegisterForm'
import { Paths } from '../../utils/Constants'


export const RegisterPage = () => {
    return (
        <div>
            <LoginHeader sideButton='Login' sideButtonPath={Paths['Login']}/>
            <RegisterForm/>
        </div>
)}

export default RegisterPage