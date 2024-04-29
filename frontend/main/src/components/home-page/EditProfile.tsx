import { useContext } from 'react'
import { ApiException, UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Checkbox, Fab, FormControlLabel, Grid, IconButton, TextField, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { ErrorMessage, Field, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import DatePickerField from '../login-pages/DatePickerField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Paths } from '../../utils/Constants'
import { useNavigate } from 'react-router-dom'
import { _apiClient } from '../../App'
import useProfilePicture from '../../hooks/useProfilePicture'
import { ToastContext } from '../context-provider/ToastProvider'

interface EditProfileValues {
    profilePicture: File | undefined
    firstName: string
    lastName: string
    birthDate: Dayjs | null
    resetPassword: boolean
}

interface EditProfileProps {
    user: UserModel | null | undefined
    handleClose: () => void
}

export const EditProfile = ( props: EditProfileProps ) => {

    const [ profilePicture ] = useProfilePicture(props?.user?.profilePictureUrl)
    const toastContext = useContext(ToastContext)

    const navigate = useNavigate()
    
    const maxDate = dayjs().subtract(18, 'year').format('MM/DD/YYYY')
    const minDate = dayjs().subtract(120, 'year').format('MM/DD/YYYY')

    const initialValues : EditProfileValues = {
        profilePicture: undefined,
        firstName: props?.user?.firstName ?? '',
        lastName: props?.user?.lastName ?? '',
        birthDate: dayjs(props?.user?.birthDate),
        resetPassword: false,
    }

    const validation = Yup.object({
        firstName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid First Name').required('Required'),
        lastName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid Last Name').required('Required'),
        birthDate: Yup.date().max(maxDate, 'Must Be At Least 18 Years Old').min(minDate, 'Invalid Date').required('Required').nullable(),
        resetPassword: Yup.bool().required('Required')
    })

    const navigateToProfile = (email : string | undefined) => {
        if (email) {
            if (email === props?.user?.email) {
                navigate(Paths.Profile, {replace: true})
            }
            else {
                navigate({
                    pathname: Paths.Profile,
                    search: `?email=${email}`
                }, {replace: true})
            }
            if (props?.handleClose) {
                props?.handleClose()
            }
        }
    }

    const onSubmit = async (values: EditProfileValues, { setSubmitting, validateForm }: FormikHelpers<EditProfileValues>) => {
        if (!values.birthDate || !values.firstName || !values.lastName) {
            toastContext.openToast(false, 'One or more fields missing!')
            setSubmitting(false)
            return
        }
        const errors: FormikErrors<EditProfileValues>  = await validateForm(values)
        if (errors.birthDate || errors.firstName || errors.lastName || errors.resetPassword || errors.profilePicture) {
            toastContext.openToast(false, 'One Or More Fields Are Invalid!')
            setSubmitting(false)
            return
        }
        try {
            if (props?.user?.email) {
                const userResponse = await _apiClient.userPUT({email: props?.user?.email,
                                                           firstName: values.firstName,
                                                           lastName: values.lastName,
                                                           birthDate: values.birthDate.format('MM/DD/YYYY')} as UserModel)
                if (values.profilePicture) {
                    await axios.put(userResponse.uploadProfilePictureUrl as string, 
                                    values.profilePicture, 
                                    { headers: { 'Content-Type': values.profilePicture.type } })
                }

                if (values.resetPassword) {
                    const emailResponse = await _apiClient.resetPassword(userResponse)
                    if (emailResponse.sent) {
                        toastContext.openToast(true, `User Updates Made! An Email Has Been Sent To ${userResponse.email} To Reset Your Password`)
                    }
                    else {
                        toastContext.openToast(false, `Email To ${userResponse.email} Failed to Send To Update Your Password`)
                    }
                }
                else {
                    toastContext.openToast(true, 'User Updates Made!')
                }
            }
            else {
                toastContext.openToast(false, 'No User Is Logged In!')
            }
        }
        catch(err: any) {
            if (err instanceof ApiException)
                toastContext.openToast(false, err.response)
            else
                toastContext.openToast(false, 'Internal Server Error')
        }
    }

    return (<>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', marginLeft: '2%'}}>
                        <Avatar src={profilePicture} sx={{ width: '5vh', height: '5vh'}}/>
                        <IconButton size='small' color='inherit' onClick={() => navigateToProfile(props?.user?.email)}>
                            <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {props?.user?.firstName} {props?.user?.lastName} </Typography>
                        </IconButton>
                    </Box>
                    { props?.handleClose ? <Button variant='contained' onClick={props?.handleClose}> Close </Button> : <></>}
                </Box>
                <Formik initialValues={initialValues} validationSchema={validation} onSubmit={onSubmit}>
                    {formik => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                            <input
                                style={{display: 'none'}}
                                accept='image/*'
                                id='profilePicture'
                                name='profilePicture'
                                type='file'
                                onChange={(e) => {if (e.target.files != null && e.target.files.length > 0) {
                                    formik.setFieldValue('profilePicture', e.target.files[0])
                                }}}
                                />
                                <Box sx={{display: 'flex', maxWidth: '90%'}}>
                                    <label htmlFor='profilePicture'>
                                        <Fab component='span' onClick={() => formik.setFieldTouched('profilePicture')}>
                                            <AddPhotoAlternateIcon />
                                        </Fab>
                                    </label> 
                                    <Typography sx={{margin: '5% 0 0 3%'}}>Profile Picture</Typography>
                                </Box>
                                {formik.values.profilePicture ?
                                <img 
                                    style={{marginTop: '2vh', maxWidth: '100%', maxHeight: '70vh'}}
                                    src={URL.createObjectURL(formik.values.profilePicture)}
                                    srcSet={URL.createObjectURL(formik.values.profilePicture)}
                                    alt={URL.createObjectURL(formik.values.profilePicture)}
                                /> : 
                                <img 
                                    style={{marginTop: '2vh', maxWidth: '100%', maxHeight: '70vh'}}
                                    src={profilePicture}
                                    srcSet={profilePicture}
                                    alt={profilePicture}
                                />}
                            </Grid>
                            <Grid item xs={6}>
                                <Grid item xs container direction='column' spacing={2}>
                                    <Grid item xs>
                                        <Field as={TextField} 
                                        label='First Name' 
                                        name='firstName' 
                                        placeholder='Enter new first name'
                                        multiline
                                        sx={{width: '100%'}}
                                        fullwidth required
                                        error={formik.errors.firstName && formik.touched.firstName ? true : false}
                                        helperText={<ErrorMessage name='firstName'/>}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <Field as={TextField} 
                                        label='Last Name' 
                                        name='lastName' 
                                        placeholder='Enter new last name'
                                        multiline 
                                        fullWidth required
                                        error={formik.errors.lastName && formik.touched.lastName ? true : false}
                                        helperText={<ErrorMessage name='lastName'/>}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <TextField 
                                        label='Email - Read Only' 
                                        name='email'
                                        placeholder='Enter new email'
                                        defaultValue={props?.user?.email}
                                        InputProps={{
                                            readOnly: true,
                                          }}
                                        multiline 
                                        fullWidth required
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Field style={{paddingBottom: '20px'}} as={DatePickerField}
                                                label='Date of Birth' 
                                                name='birthDate'
                                                values={formik.values.birthDate}
                                                error={false}
                                                helperText={<ErrorMessage name='birthDate'/>}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs>
                                        <FormControlLabel control={<Checkbox onClick={() => formik.setFieldValue('resetPassword', !formik.values.resetPassword)} />} label='Reset Password' name='resetPassword'/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', paddingTop: '2vh'}}>
                            <Button variant='contained' type='submit' disabled={formik.isSubmitting}> Save Changes </Button>
                        </Box>
                    </Form>
                    )}
                </Formik>
            </>)
}

export default EditProfile