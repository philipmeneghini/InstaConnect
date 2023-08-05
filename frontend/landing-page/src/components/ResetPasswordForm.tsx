import React, { useState } from 'react'
import { Formik, Form, ErrorMessage, FormikHelpers, FormikErrors } from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, Grid,TextField } from '@mui/material'
import { FormProperties } from '../utils/FormProperties'
import LoginRegisterAlert from './LoginRegisterAlert'
import { _userApiClient, _authenticationApiClient, _emailApiClient} from '../App'
import { GenericResponse, UserModel } from '../api_views/IBaseApiClient'
import { AxiosRequestConfig } from 'axios'
import { GuestEmail, GuestPassword, Paths } from '../utils/Constants'
import LoginHeader from './LoginHeader'

export interface ResetPasswordFormValues {
    email: string
}

export const ResetPasswordForm = () => {
    const [passwordReset, setPasswordReset] = useState<FormProperties>({
        isOpen: false,
        isSuccess: false,
        message: ''
      });

    const initialValues : ResetPasswordFormValues = {
        email: ''
    }

    const onSubmit = async (values: ResetPasswordFormValues, { setSubmitting, resetForm, validateForm }: FormikHelpers<ResetPasswordFormValues>): Promise<void> => {
        if (!values.email) {
            setPasswordReset({
                isOpen: true,
                isSuccess: false,
                message: 'Email Field Missing'
            })
            setSubmitting(false)
            return
        }
        const errors: FormikErrors<ResetPasswordFormValues>  = await validateForm(values)
        if (errors.email) {
            setPasswordReset({
                isOpen: true,
                isSuccess: false,
                message: 'Email is Invalid'
            })
            setSubmitting(false)
            return
        }
        const jwtResponse: GenericResponse<string> = await _authenticationApiClient.login(GuestEmail, GuestPassword)
        if (jwtResponse.data) {
            const header: AxiosRequestConfig = {headers: {Authorization: 'Bearer ' + jwtResponse.data}}
            const response: GenericResponse<UserModel>  = await _userApiClient.getUser(values.email, header)
            if (response.data) {
                const emailResponse: GenericResponse<boolean> = await _emailApiClient.sendResetPasswordEmail(response.data, header)
                if (emailResponse.data) {
                    setPasswordReset({
                        isOpen: true,
                        isSuccess: true,
                        message: `An Email Has Been Sent To ${response.data?.email}`
                    })
                    resetForm()
                }
                else {
                    setPasswordReset({
                        isOpen: true,
                        isSuccess: false,
                        message: `Email To ${response.data?.email} Failed to Send`
                    })
                }
            }
            else {
                let resetPasswordProperties: FormProperties = {
                    isOpen: true,
                    isSuccess: false,
                    message: response.message ? String(response.statusCode) : String(response.statusCode) + ': ' + response.message
                }
                if (response.statusCode === undefined) {
                    resetPasswordProperties.message = 'Network Error'
                    setPasswordReset(resetPasswordProperties)
                }
                else if (response.statusCode === 404) {
                    resetPasswordProperties.message = 'No user with this email exists'
                    setPasswordReset(resetPasswordProperties)
                }
                else {
                    setPasswordReset(resetPasswordProperties)
                }
            }
        }
        else {
            setPasswordReset({
                isOpen: true,
                isSuccess: false,
                message: 'Internal Authentication Error'
            })
        }
        setSubmitting(false)
    }

    const validation = Yup.object({
        email: Yup.string().email('Invalid Email').required('Required')
    })

    return (
        <>
            <LoginHeader sideButton='Login' sideButtonPath={Paths['Login']}/>
            <Formik initialValues={initialValues} validationSchema={validation} onSubmit={onSubmit}>
            {
                formik => (
                <Form style={{display: 'flex', verticalAlign: 'middle', marginTop: '15px', flexDirection: 'column'}}autoComplete='off'>
                    <Grid container spacing={5} direction='column' justifyContent='center' alignItems='center' sx={{ minHeight: '100vh' }}>
                        <Grid item xs={12} sx={{maxHeight:'100px'}}>
                            <FormControl sx={{ verticalAlign: 'center', m: 1, width: '60ch' }} variant='outlined'>
                                <TextField
                                    type='email'
                                    label='Email'
                                    name='email'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.errors.email && formik.touched.email ? true : false}
                                    helperText={formik.errors.email && <ErrorMessage name='email'/>}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button disabled={formik.isSubmitting} variant='contained' type='submit'>Submit</Button>
                        </Grid>
                    </Grid>
                </Form>)   
            }
            </Formik>
            <LoginRegisterAlert login={passwordReset} setLogin={setPasswordReset} />
        </>
    )
}

export default ResetPasswordForm