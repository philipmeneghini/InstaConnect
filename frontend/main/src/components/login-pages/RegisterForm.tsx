import React, { useState } from 'react'
import { Field, Formik, Form, ErrorMessage, FormikHelpers, FormikErrors } from 'formik'
import * as Yup from 'yup'
import { Button, Grid, Paper, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import { FormProperties } from '../../utils/FormProperties'
import SubmissionAlert from './SubmissionAlert'
import { _apiClient} from '../../App'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DatePickerField from './DatePickerField'
import { ApiException } from '../../api/Client'

export interface RegisterFormValues {
    firstName: string
    lastName: string
    email: string
    birthDate: string | null
}

export const RegisterForm = () => {
    const [register, setRegister] = useState<FormProperties>({
        isOpen: false,
        isSuccess: false,
        message: ''
      })

    const maxDate = dayjs().subtract(18, 'year').format('MM/DD/YYYY')
    const minDate = dayjs().subtract(120, 'year').format('MM/DD/YYYY')

    const initialValues : RegisterFormValues = {
        firstName: '',
        lastName: '',
        email: '',
        birthDate: null
    }

    const onSubmit = async (values: RegisterFormValues, { setSubmitting, resetForm, validateForm }: FormikHelpers<RegisterFormValues>): Promise<void> => {
        if (!values.firstName || !values.lastName || !values.email || !values.birthDate) {
            setRegister({
                isOpen: true,
                isSuccess: false,
                message: 'Registration Failed! One Or More Fields Missing'
            })
            setSubmitting(false)
            return
        }
        const errors: FormikErrors<RegisterFormValues>  = await validateForm(values)
        if (errors.firstName || errors.lastName || errors.email || errors.birthDate) {
            setRegister({
                isOpen: true,
                isSuccess: false,
                message: 'Registration Failed! One Or More Fields Are Invalid'
            })
            setSubmitting(false)
            return
        }
        try {
            const jwtResponse = await _apiClient.login({ email: process.env.REACT_APP_GUEST_EMAIL!, password: process.env.REACT_APP_GUEST_PASSWORD! })
            localStorage.setItem('token', jwtResponse.token ?? '')
            const userResponse = await _apiClient.userPOST({firstName: values.firstName, lastName: values.lastName, email: values.email, birthDate: values.birthDate ?? ''})
            const emailResponse = await _apiClient.registration(userResponse)
            if (emailResponse.sent) {
                setRegister({
                    isOpen: true,
                    isSuccess: true,
                    message: `Registration Success! An Email Has Been Sent To ${userResponse.email}`
                })
                resetForm()
            }
            else {
                setRegister({
                    isOpen: true,
                    isSuccess: false,
                    message: `Email To ${userResponse.email} Failed to Send`
                })
            }
        }
        catch(err: any){
            let failedRegistrationResult: FormProperties = {
                isOpen: true,
                isSuccess: false,
                message: ''
            }
            if (err instanceof ApiException)
                failedRegistrationResult.message = err.response
            else
                failedRegistrationResult.message = 'Internal Server Error'
            setRegister(failedRegistrationResult)
        }
        setSubmitting(false)
        localStorage.setItem('token', '')
    }

    const validation = Yup.object({
        firstName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid First Name').required('Required'),
        lastName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid Last Name').required('Required'),
        email: Yup.string().email('Invalid Email').required('Required'),
        birthDate: Yup.date().max(maxDate, 'Must Be At Least 18 Years Old').min(minDate, 'Invalid Date').required('Required').nullable() /*Yup.string().matches(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, 'Please Enter a Valid Date (MM-DD-YYYY)').required('Required')*/
    })

    const paperStyle = {padding:20, height:'60vh', width:380, marginLeft:'35%', marginTop:'150px'}

    return (
        <Grid>
            <Paper elevation={10} style = {paperStyle}>
                <Typography mt={2} fontSize={25}>Registration</Typography>
                <Formik initialValues={initialValues} validationSchema={validation} onSubmit={onSubmit}>
                {
                    formik => (
                    <Form style={{display: 'flex', verticalAlign: 'middle', marginTop: '15px', flexDirection: 'column'}} autoComplete='off'>
                        <Grid sx ={{paddingTop: '10px', paddingBottom: '20px', maxHeight:'85px'}}>
                            <Field as={TextField} 
                                label='First Name' 
                                name='firstName' 
                                placeholder='Enter Your First Name' 
                                fullWidth required
                                error={formik.errors.firstName && formik.touched.firstName ? true : false}
                                helperText={<ErrorMessage name='firstName'/>}
                            />
                        </Grid>
                        <Grid sx ={{paddingTop: '10px', paddingBottom: '20px', maxHeight:'85px'}}>
                            <Field as={TextField} 
                                label='Last Name' 
                                name='lastName' 
                                placeholder='Enter Your Last Name' 
                                fullWidth required
                                error={formik.errors.lastName && formik.touched.lastName ? true : false}
                                helperText={<ErrorMessage name='lastName'/>}
                            />
                        </Grid>
                        <Grid sx ={{paddingTop: '10px', paddingBottom: '20px', maxHeight:'85px'}}>
                            <Field as={TextField} 
                                label='Email' 
                                name='email' 
                                placeholder='Enter Your Email' 
                                fullWidth required
                                error={formik.errors.email && formik.touched.email ? true : false}
                                helperText={<ErrorMessage name='email'/>}
                            />
                        </Grid>
                        <Grid sx ={{paddingTop: '10px', paddingBottom: '20px', maxHeight:'70px'}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Field style={{paddingBottom: '20px'}} as={DatePickerField}
                                    label='Date of Birth' 
                                    name='birthDate'
                                    fullWidth required
                                    values={formik.values.birthDate}
                                    error={false}
                                    helperText={<ErrorMessage name='birthDate'/>}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid sx={{paddingTop: '17px'}}>
                            <div style={{display: 'block'}}>
                                <Button disabled={formik.isSubmitting} variant='contained' type='submit'>Register </Button>
                            </div>
                        </Grid>
                    </Form>)   
                }
                </Formik>
            </Paper>
            <SubmissionAlert value={register} setValue={setRegister} />
        </Grid>
    )
}

export default RegisterForm