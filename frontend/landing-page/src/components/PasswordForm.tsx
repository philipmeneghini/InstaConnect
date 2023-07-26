import React, { useState } from 'react'
import { Field, Formik, Form, ErrorMessage, FormikProps } from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material'
import { FormProperties } from '../utils/FormProperties'
import LoginRegisterAlert from './LoginRegisterAlert'
import { _userApiClient, _authenticationApiClient, _emailApiClient} from '../App'
import { GenericResponse, UserModel } from '../api_views/IBaseApiClient'
import { AxiosRequestConfig } from 'axios'
import { GuestEmail, GuestPassword } from '../utils/Constants'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import LoginHeader from './LoginHeader'

export interface PasswordFormValues {
    password: string
    confirmPassword: string
}

export const PasswordForm = () => {
    const [register, setRegister] = useState<FormProperties>({
        isOpen: false,
        isSuccess: false,
        message: ''
      });

    const initialValues : PasswordFormValues = {
        password: '',
        confirmPassword: ''
    }

    const handleClickSubmit = async(formik: FormikProps<PasswordFormValues>) => {
        const registerForm: PasswordFormValues = {
            password: formik.values.password,
            confirmPassword: formik.values.confirmPassword
        }

        if (!registerForm.password || !registerForm.confirmPassword) {
            setRegister({
                isOpen: true,
                isSuccess: false,
                message: 'Password Submition Failed! One Or More Fields Missing'
            })
            return
        }
        else if (formik.errors.password || formik.errors.confirmPassword) {
            setRegister({
                isOpen: true,
                isSuccess: false,
                message: 'Registration Failed! One Or More Fields Are Invalid'
            })
            return
        }
        const jwtResponse: GenericResponse<string> = await _authenticationApiClient.login(GuestEmail, GuestPassword)
        if (jwtResponse.data) {
            const header: AxiosRequestConfig = {headers: {Authorization: 'Bearer ' + jwtResponse.data}}
            const response: GenericResponse<UserModel>  = await _userApiClient.createUser(registerForm, header)
            if (response.data) {
                const emailResponse: GenericResponse<boolean> = await _emailApiClient.sendRegistrationEmail(response.data, header)
                if (emailResponse.data) {
                    setRegister({
                        isOpen: true,
                        isSuccess: true,
                        message: `Registration Success! An Email Has Been Sent To ${response.data?.email}`
                    })
                }
                else {
                    setRegister({
                        isOpen: true,
                        isSuccess: false,
                        message: `Email To ${response.data?.email} Failed to Send`
                    })
                }
            }
            else {
                let registerProperties: FormProperties = {
                    isOpen: true,
                    isSuccess: false,
                    message: response.message ? String(response.statusCode) : String(response.statusCode) + ': ' + response.message
                }
                if (response.statusCode === undefined) {
                    registerProperties.message = 'Network Error'
                    setRegister(registerProperties)
                }
                else {
                    setRegister(registerProperties)
                }
            }
        }
        else {
            setRegister({
                isOpen: true,
                isSuccess: false,
                message: 'Internal Authentication Error'
            })
        }
    }

    const validation = Yup.object({
        password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be a minimum of eight characters and include one uppercase and lowercase letter, number and special character').required('Required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required')
    })

    return (
        <>
            <LoginHeader sideButton='' sideButtonPath=''/>
            <Formik initialValues={initialValues} validationSchema={validation} onSubmit={values => {console.log(values)}}>
                {
                    formik => (
                        <>
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
                                    onClick= {() => console.log(formik)}
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
                                    onClick= {() => console.log(formik)}
                                    error={formik.errors.confirmPassword && formik.touched.confirmPassword ? true : false}
                                    helperText={formik.errors.confirmPassword && <ErrorMessage name='confirmPassword'/>}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant='contained'>Submit</Button>
                            </Grid>
                        </Grid>
                        </>
                         )
                }
            </Formik>
            <LoginRegisterAlert login={register} setLogin={setRegister} />
        </>
    )
}

export default PasswordForm