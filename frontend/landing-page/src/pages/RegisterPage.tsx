import React from 'react'
import LoginHeader from '../components/LoginHeader'
import RegisterForm from '../components/RegisterForm'
import { SideButton } from '../utils/Constants'


export const RegisterPage = () => {
    return (
        <div>
            <LoginHeader sideButton='Login' sideButtonPath={SideButton['Login']}/>
            <RegisterForm/>
        </div>
)}

export default RegisterPage