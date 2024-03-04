import React, { useContext } from 'react'
import { Formik, Form, ErrorMessage, FormikHelpers, FormikErrors } from 'formik'
import * as Yup from 'yup'
import { Button, FormControl, Grid,TextField } from '@mui/material'
import { _apiClient } from '../../App'
import { Paths } from '../../utils/Constants'
import LoginHeader from './LoginHeader'
import { ApiException } from '../../api/Client'
import { NotificationContext } from '../context-provider/NotificationProvider'

export interface ResetPasswordFormValues {
    email: string
}

export const ResetPasswordForm = () => {
    const notificationContext = useContext(NotificationContext)

    const initialValues : ResetPasswordFormValues = {
        email: ''
    }

    const onSubmit = async (values: ResetPasswordFormValues, { setSubmitting, resetForm, validateForm }: FormikHelpers<ResetPasswordFormValues>): Promise<void> => {
        if (!values.email) {
            notificationContext.openNotification(false, 'Email Field Missing')
            setSubmitting(false)
            return
        }
        const errors: FormikErrors<ResetPasswordFormValues>  = await validateForm(values)
        if (errors.email) {
            notificationContext.openNotification(false, 'Email is Invalid')
            setSubmitting(false)
            return
        }
        try {
            const jwtResponse = await _apiClient.login({ email: process.env.REACT_APP_GUEST_EMAIL!, password: process.env.REACT_APP_GUEST_PASSWORD! })
            localStorage.setItem('token', jwtResponse.token ?? '')
            const userResponse = await _apiClient.userGET(values.email)
            const emailResponse = await _apiClient.resetPassword(userResponse)
            if (emailResponse.sent) {
                notificationContext.openNotification(true, `An Email Has Been Sent To ${userResponse.email}`)
                resetForm()
            }
            else {
                notificationContext.openNotification(false, `Email To ${userResponse.email} Failed to Send`)
            }
        }
        catch(err: any){
            if (err instanceof ApiException)
                notificationContext.openNotification(false, err.response)
            else
                notificationContext.openNotification(false, 'Internal Server Error')
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
        </>
    )
}

export default ResetPasswordForm