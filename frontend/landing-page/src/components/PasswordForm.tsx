import React, { useState } from 'react'
import { Formik, ErrorMessage, FormikProps, FormikHelpers, FormikErrors, Form } from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, Grid, TextField } from '@mui/material'
import { FormProperties } from '../utils/FormProperties'
import LoginRegisterAlert from './LoginRegisterAlert'
import { _userApiClient, _authenticationApiClient, _emailApiClient} from '../App'
import { GenericResponse, UserModel } from '../api_views/IBaseApiClient'
import { AxiosRequestConfig } from 'axios'
import { GuestEmail, GuestPassword, Paths } from '../utils/Constants'
import LoginHeader from './LoginHeader'
import { useNavigate } from 'react-router-dom'

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

    const goToLoginScreen = () => {
        navigate(Paths['Login'], { replace: true })
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
        const jwtResponse: GenericResponse<string> = await _authenticationApiClient.login(GuestEmail, GuestPassword)
        if (jwtResponse.data) {
            const header: AxiosRequestConfig = {headers: {Authorization: 'Bearer ' + jwtResponse.data}}
            const response: GenericResponse<UserModel>  = await _authenticationApiClient.register(prop.email, values.confirmPassword, header)
            if (response.data) {
                setPasswordResult({
                    isOpen: true,
                    isSuccess: true,
                    message: 'Password Submission Success!'
                })
                resetForm()
                setTimeout(() => 
                { navigate(Paths['Login'], { replace: true })}, 
                5000);
            }
            else {
                setPasswordResult({
                    isOpen: true,
                    isSuccess: false,
                    message: `Password Submission Failed! ${response.statusCode}: ${response.message}`
                })
            }
        }
        else if (jwtResponse.statusCode === undefined) {
            setPasswordResult({
                isOpen: true,
                isSuccess: false,
                message: 'Network Error'
            })
        }
        else {
            setPasswordResult({
                isOpen: true,
                isSuccess: false,
                message: `Password Submission Failed! ${jwtResponse.statusCode}: ${jwtResponse.message}`
            })
        }
        setSubmitting(false)
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