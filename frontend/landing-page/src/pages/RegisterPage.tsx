import React from 'react'
import LoginHeader from '../components/LoginHeader'
import RegisterForm from '../components/RegisterForm'
import { Paths } from '../utils/Constants'


export const RegisterPage = () => {
    return (
        <div>
            <LoginHeader sideButton='Login' sideButtonPath={Paths['Login']}/>
            <RegisterForm/>
        </div>
)}

export default RegisterPage