import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button } from '@mui/material'

export const RegisterForm = () => {

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: ''
    }

    const maxDate = new Date().setUTCFullYear(new Date().getUTCFullYear()-18)

    const validation = Yup.object({
        firstName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid First Name').required('Required'),
        lastName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid Last Name').required('Required'),
        email: Yup.string().email('Invalid Email').required('Required'),
        dateOfBirth: Yup.date().max(maxDate, 'You Must be at Least 18 Years Old').required('Required')
    })

    const onSubmit = () => {

    }

    return (
        <Formik initialValues={initialValues} validationScheme={validation} onSubmit={onSubmit}>
            {
                formik => (
                    <Form autoComplete='off'>
                        <label htmlFor='firstName'>First Name</label>
                        <input
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            id='firstName'
                            type='firstName'
                            placeholder='Enter Your First Name'
                        />
                        <label htmlFor='lastName'>Last Name</label>
                        <input
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            id='lastName'
                            type='lastName'
                            placeholder='Enter Your Last Name'
                        />
                        <label htmlFor='email'>Email</label>
                        <input
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            id='email'
                            type='email'
                            placeholder='Enter Your Email'
                        />
                        <label htmlFor='dateOfBirth'>Date Of Birth</label>
                        <input
                            value={formik.values.dateOfBirth}
                            onChange={formik.handleChange}
                            id='dateOfBirth'
                            type='dateOfBirth'
                            placeholder='Enter Your Date of Birth'
                        />
                        <Button type='submit'>Submit</Button>
                    </Form>
                )   
            }
        </Formik>
    )
}

export default RegisterForm