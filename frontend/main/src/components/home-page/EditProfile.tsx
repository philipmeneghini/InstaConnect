import { useEffect, useState } from 'react'
import { UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Fab, Grid, IconButton, TextField, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { FormProperties } from '../../utils/FormProperties'
import axios from 'axios'
import SubmissionAlert from '../login-pages/SubmissionAlert'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import DatePickerField from '../login-pages/DatePickerField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Paths } from '../../utils/Constants'
import { useNavigate } from 'react-router-dom'

interface EditProfileValues {
    profilePicture: File | undefined
    firstName: string
    lastName: string
    birthDate: string | null
}

interface EditProfileProps {
    user: UserModel | null | undefined
    handleClose: () => void
}

export const EditProfile = ( props: EditProfileProps ) => {

    const [ profilePicture, setProfilePicture ] = useState<string>()
    const [ userEdits, setUserEdits ] = useState<FormProperties>(({
        isOpen: false,
        isSuccess: false,
        message: ''
      }))

    useEffect(() => {
        const validateUrl = async(url: string) => { 
            try {
                await axios.get(url)
                setProfilePicture(url)
            } 
            catch {
                setProfilePicture('')
            }
        }
        validateUrl(props?.user?.profilePictureUrl as string)
    }, [props])

    const navigate = useNavigate()
    
    const maxDate = dayjs().subtract(18, 'year').format('MM/DD/YYYY')
    const minDate = dayjs().subtract(120, 'year').format('MM/DD/YYYY')

    const initialValues : EditProfileValues = {
        profilePicture: undefined,
        firstName: props?.user?.firstName ?? '',
        lastName: props?.user?.lastName ?? '',
        birthDate: null
    }

    const validation = Yup.object({
        firstName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid First Name').required('Required'),
        lastName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid Last Name').required('Required'),
        birthDate: Yup.date().max(maxDate, 'Must Be At Least 18 Years Old').min(minDate, 'Invalid Date').required('Required').nullable()
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

    const onSubmit = async (values: EditProfileValues, { setSubmitting, resetForm, validateForm }: FormikHelpers<EditProfileValues>) => {
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
                                        fullwidth required
                                        multiline
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
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', paddingTop: '2vh'}}>
                            <Button variant='contained' type='submit' disabled={formik.isSubmitting}> Save Changes </Button>
                        </Box>
                    </Form>
                    )}
                </Formik>
                <SubmissionAlert value={userEdits} setValue={setUserEdits}/>
            </>)
}

export default EditProfile