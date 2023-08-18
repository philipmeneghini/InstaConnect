import React, { useState } from 'react'
import { Formik, ErrorMessage, FormikHelpers, FormikErrors, Form } from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, Grid, TextField } from '@mui/material'
import { FormProperties } from '../utils/FormProperties'
import LoginRegisterAlert from './LoginRegisterAlert'
import { _apiClient } from '../App'
import { Paths } from '../utils/Constants'
import LoginHeader from './LoginHeader'
import { useNavigate } from 'react-router-dom'
import { ApiException, LoginResponse } from '../api/Client'

export interface PasswordFormValues {
    password: string
    confirmPassword: string
}

interface PasswordProps {
    email: string
}

export const PasswordForm = (prop: PasswordProps) => {
    const [passwordResult, setPasswordResult] = useState<FormProperties>({
        isOpen: false,
        isSuccess: false,
        message: ''
      });

    const navigate = useNavigate()

    const initialValues : PasswordFormValues = {
        password: '',
        confirmPassword: ''
    }

    const onSubmit = async(values: PasswordFormValues, { setSubmitting, resetForm, validateForm }: FormikHelpers<PasswordFormValues>): Promise<void> => {
        if (!values.password || !values.confirmPassword) {
            setPasswordResult({
                isOpen: true,
                isSuccess: false,
                message: 'Password Submission Failed! One Or More Fields Missing'
            })
            setSubmitting(false)
            return
        }
        const errors: FormikErrors<PasswordFormValues>  = await validateForm(values)
        if (errors.password || errors.confirmPassword) {
            setPasswordResult({
                isOpen: true,
                isSuccess: false,
                message: 'Password Submission Failed! One Or More Fields Are Invalid'
            })
            setSubmitting(false)
            return
        }
        try {
            const jwtResponse: LoginResponse = await _apiClient.login({ email: process.env.REACT_APP_GUEST_EMAIL!, password: process.env.REACT_APP_GUEST_PASSWORD! })
            localStorage.setItem('token', jwtResponse.token ?? '')
            await _apiClient.register({ email: prop.email, password: values.confirmPassword})
            setPasswordResult({
                isOpen: true,
                isSuccess: true,
                message: 'Password Submission Success!'
            })
            resetForm()
            setTimeout(() => 
            { navigate(Paths['Login'], { replace: true })}, 
            5000)
        }
        catch(err: any){
            let failedPasswordResult: FormProperties = {
                isOpen: true,
                isSuccess: false,
                message: 'Password Submission Failed!'
            }
            if (err instanceof ApiException)
                failedPasswordResult.message = failedPasswordResult.message + '' + err.response
            else
                failedPasswordResult.message = failedPasswordResult.message + ' Internal Server Error'
            setPasswordResult(failedPasswordResult)
        }
        setSubmitting(false)
        localStorage.setItem('token', '')
    }

    const validation = Yup.object({
        password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be a minimum of eight characters and include one uppercase and lowercase letter, number and special character').required('Required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required')
    })

    return (
        <>
            <Formik initialValues={initialValues} validationSchema={validation} onSubmit={onSubmit}>
                {
                    formik => (
                        <>
                            <LoginHeader sideButton='Login' sideButtonPath={Paths['Login']}/>
                            <Form>
                                <Grid container spacing={5} direction='column' justifyContent='center' alignItems='center' sx={{ minHeight: '100vh' }}>
                                    <Grid item xs={12} sx={{maxHeight:'100px'}}>
                                        <FormControl sx={{ verticalAlign: 'center', m: 1, width: '60ch' }} variant='outlined'>
                                            <TextField
                                            id='outlined-adornment-password'
                                            type='password'
                                            label='Password'
                                            name='password'
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.errors.password && formik.touched.password ? true : false}
                                            helperText={formik.errors.password && <ErrorMessage name='password'/>}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sx={{maxHeight:'100px'}}>
                                        <FormControl sx={{ m: 1, width: '60ch' }} variant="outlined">
                                            <TextField
                                            id='outlined-adornment-confirmPassword'
                                            type='password'
                                            label='Confirm Password'
                                            name='confirmPassword'
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.errors.confirmPassword && formik.touched.confirmPassword ? true : false}
                                            helperText={formik.errors.confirmPassword && <ErrorMessage name='confirmPassword'/>}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button disabled={formik.isSubmitting} variant='contained' type='submit'>Submit</Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        </>)
                }
            </Formik>
            <LoginRegisterAlert login={passwordResult} setLogin={setPasswordResult} />
        </>
    )
}

export default PasswordForm