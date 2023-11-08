import React, { useState } from 'react'
import { Formik, Form, ErrorMessage, FormikHelpers, FormikErrors } from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, Grid,TextField } from '@mui/material'
import { FormProperties } from '../../utils/FormProperties'
import LoginRegisterAlert from './LoginRegisterAlert'
import { _apiClient } from '../../App'
import { Paths } from '../../utils/Constants'
import LoginHeader from './LoginHeader'
import { ApiException } from '../../api/Client'

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
        try {
            const jwtResponse = await _apiClient.login({ email: process.env.REACT_APP_GUEST_EMAIL!, password: process.env.REACT_APP_GUEST_PASSWORD! })
            localStorage.setItem('token', jwtResponse.token ?? '')
            const userResponse = await _apiClient.userGET(values.email)
            const emailResponse = await _apiClient.resetPassword(userResponse)
            if (emailResponse.sent) {
                setPasswordReset({
                    isOpen: true,
                    isSuccess: true,
                    message: `An Email Has Been Sent To ${userResponse.email}`
                })
                resetForm()
            }
            else {
                setPasswordReset({
                    isOpen: true,
                    isSuccess: false,
                    message: `Email To ${userResponse.email} Failed to Send`
                })
            }
        }
        catch(err: any){
            let failedEmailResult: FormProperties = {
                isOpen: true,
                isSuccess: false,
                message: ''
            }
            if (err instanceof ApiException)
                failedEmailResult.message = err.response
            else
                failedEmailResult.message = 'Internal Server Error'
            setPasswordReset(failedEmailResult)
        }
        setSubmitting(false)
        localStorage.setItem('token', '')
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