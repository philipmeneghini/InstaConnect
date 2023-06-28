import React, { useState } from 'react'
import { Field, Formik, Form, ErrorMessage, FormikProps } from 'formik'
import * as Yup from 'yup'
import { Button, Grid, Paper, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { FormProperties } from '../utils/FormProperties'
import LoginRegisterAlert from './LoginRegisterAlert'
import { _userApiClient } from '../App'
import { GenericResponse, UserModel } from '../api_views/IBaseApiClient'

export interface RegisterFormValues {
    firstName: string
    lastName: string
    email: string
    dateOfBirth: string
}

export const RegisterForm = () => {
    const [register, setRegister] = useState<FormProperties>({
        isOpen: false,
        isSuccess: false,
        message: ''
      });

    const maxDate = dayjs().subtract(18, "year").format("YYYY-MM-DD")
    const minDate = dayjs().subtract(120, "year").format("YYYY-MM-DD")

    const initialValues : RegisterFormValues = {
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: 'YYYY-MM-DD'
    }

    const handleClickRegister = async(formik: FormikProps<RegisterFormValues>) => {
        const registerForm: RegisterFormValues = {
            firstName: formik.values.firstName,
            lastName: formik.values.lastName,
            email: formik.values.email,
            dateOfBirth: formik.values.dateOfBirth
        }

        if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.dateOfBirth) {
            setRegister({
                isOpen: true,
                isSuccess: false,
                message: 'Registration Failed! One Or More Fields Missing'
            })
            return
        }
        else if (formik.errors.firstName || formik.errors.lastName || formik.errors.email || formik.errors.dateOfBirth) {
            setRegister({
                isOpen: true,
                isSuccess: false,
                message: "Registration Failed! One Or More Fields Are Invalid"
            })
            return
        }
        const response: GenericResponse<UserModel>  = await _userApiClient.createUser(registerForm)
        if (response.data) {
            setRegister({
                isOpen: true,
                isSuccess: true,
                message: `Registration Success! An Email Has Been Sent To ${response.data?.email}`
            })
        }
        else {
            let registerProperties: FormProperties = {
                isOpen: true,
                isSuccess: false,
                message: response.message ? String(response.statusCode) : String(response.statusCode) + ': ' + response.message
            }
            if (response.statusCode === undefined) {
                registerProperties.message = "Network Error"
                setRegister(registerProperties)
            }
            else {
                setRegister(registerProperties)
            }
        }
    }

    const validation = Yup.object({
        firstName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid First Name').required('Required'),
        lastName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid Last Name').required('Required'),
        email: Yup.string().email('Invalid Email').required('Required'),
        dateOfBirth: Yup.date().max(maxDate, 'Must Be At Least 18 Years Old').min(minDate, 'Invalid Date').required('Required') /*Yup.string().matches(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, 'Please Enter a Valid Date (YYY-MM-DD)').required('Required')*/
    })

    const paperStyle = {padding:20, height:'60vh', width:380, marginLeft:'35%', marginTop:'150px'}

    return (
        <Grid>
            <Paper elevation={10} style = {paperStyle}>
                <Typography mt={2} fontSize={25}>Registration</Typography>
                <Formik initialValues={initialValues} validationSchema={validation} onSubmit={values => {console.log(values)}}>
                {
                    formik => (
                    <Form style={{display: 'flex', verticalAlign: 'middle', marginTop: '15px', flexDirection: 'column'}}autoComplete='off'>
                        <Field as={TextField} label='First Name' name='firstName' placeholder='Enter Your First Name' fullWidth required
                        helperText={<ErrorMessage name='firstName'/>}/>
                        <Field style={{marginTop:'10px'}} as={TextField} label='Last Name' name='lastName' placeholder='Enter Your Last Name' fullWidth required
                        helperText={<ErrorMessage name='lastName'/>}/>
                        <Field style={{marginTop:'10px'}} as={TextField} label='Email' name='email' placeholder='Enter Your Email' fullWidth required
                        helperText={<ErrorMessage name='email'/>}/>
                        <Field style={{marginTop:'10px'}} as={TextField} label='Date of Birth' name='dateOfBirth' placeholder='Enter Your Date of Birth' fullWidth required
                        helperText={<ErrorMessage name='dateOfBirth'/>}/>
                        <div style={{display: 'block'}}>
                            <Button type='submit' onClick={() => handleClickRegister(formik)}>Register </Button>
                        </div>
                    </Form>)   
                }
                </Formik>
            </Paper>
            <LoginRegisterAlert login={register} setLogin={setRegister} />
        </Grid>
    )
}

export default RegisterForm