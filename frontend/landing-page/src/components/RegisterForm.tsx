import React from 'react'
import { Field, Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button, Grid, Paper, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'

interface InitialValues {
    firstName: string
    lastName: string
    email: string
    dateOfBirth: string
}

export const RegisterForm = () => {

    const maxDate = dayjs().subtract(18, "year").format("YYYY-MM-DD")
    const minDate = dayjs().subtract(120, "year").format("YYYY-MM-DD")

    const initialValues : InitialValues = {
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: 'YYYY-MM-DD'
    }

    const validation = Yup.object({
        firstName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid First Name').required('Required'),
        lastName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid Last Name').required('Required'),
        email: Yup.string().email('Invalid Email').required('Required'),
        dateOfBirth: Yup.date().max(maxDate, 'Must Be At Least 18 Years Old').min(minDate, 'Invalid Date').required('Required')//Yup.string().matches(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, 'Please Enter a Valid Date (YYY-MM-DD)').required('Required').isValid(maxDate<)
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
                            <Button type='submit'>Register</Button>
                        </div>
                    </Form>)   
                }
                </Formik>
            </Paper>
        </Grid>
    )
}

export default RegisterForm