import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button, Grid, Paper } from '@mui/material'
import Typography from '@mui/material/Typography'

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
        email: Yup.string().email('Invalid Email').required('Required')
        //dateOfBirth: Yup.date().max(maxDate, 'You Must be at Least 18 Years Old').required('Required')
    })

    const paperStyle = {padding:20, height:'50vh', width:380, marginLeft:'35%', marginTop:'150px'}
    const inputStyle = {padding:'5px', borderRadius:'10px', marginRight:'30px', marginLeft:'30px', marginBottom:'15px'}

    return (
        <Grid>
            <Paper elevation={10} style = {paperStyle}>
                <Typography mt={2} fontSize={25}>Registration</Typography>
                <Formik initialValues={initialValues} validationSchema={validation} onSubmit={values => {console.log(values)}}>
                {
                    formik => (
                    <Form style={{ display: 'flex', verticalAlign: 'middle', marginTop: '15px', flexDirection: 'column'}}autoComplete='off'>
                        <label htmlFor='firstName'>First Name</label>
                        <input
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            id='firstName'
                            type='firstName'
                            placeholder='Enter Your First Name'
                            required={true}
                            style={{padding: '5px',borderRadius: '10px',textAlign: 'center', marginRight: '30px', marginLeft: '30px', marginBottom: '15px' }}
                        />
                        <label htmlFor='lastName'>Last Name</label>
                        <input
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            id='lastName'
                            type='lastName'
                            placeholder='Enter Your Last Name'
                            style={{padding: '5px',borderRadius: '10px',textAlign: 'center', marginRight: '30px', marginLeft: '30px', marginBottom: '15px' }}
                        />
                        <label htmlFor='email'>Email</label>
                        <input
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            id='email'
                            type='email'
                            placeholder='Enter Your Email'
                            style={{padding: '5px',borderRadius: '10px',textAlign: 'center', marginRight: '30px', marginLeft: '30px', marginBottom: '15px' }}
                        />
                        <label htmlFor='dateOfBirth'>Date Of Birth</label>
                        <input
                            value={formik.values.dateOfBirth}
                            onChange={formik.handleChange}
                            id='dateOfBirth'
                            type='dateOfBirth'
                            placeholder='Enter Your Date of Birth'
                            style={{padding: '5px',borderRadius: '10px',textAlign: 'center', marginRight: '30px', marginLeft: '30px', marginBottom: '15px' }}
                        />
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