import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { ContentModel, MediaType, UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Fab, Grid, TextField, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { ErrorMessage, Field, Form, Formik, FormikErrors, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { FormProperties } from '../../utils/FormProperties'
import axios from 'axios'
import SubmissionAlert from '../login-pages/SubmissionAlert'
import dayjs from 'dayjs'

interface EditProfileValues {
    profilePicture: File | undefined
    firstName: string
    lastName: string
    birthDate: string | null
}

interface EditProfileProps {
    handleClose: () => void
}

export const EditProfile = ( props: EditProfileProps ) => {

    const [ user, setUser ] = useState<UserModel>()
    const [ userEdits, setUserEdits ] = useState<FormProperties>(({
        isOpen: false,
        isSuccess: false,
        message: ''
      }))

    useEffect(() => {
        const getUser = async(jwt: string | null | undefined) => {
            if (jwt) {
                try {
                    const jwtResponse = await _apiClient.verifyToken(jwt)
                    const user = await _apiClient.userGET(jwtResponse.email)
                    setUser(user)
                }
                catch(err: any) {
                    setUser(undefined)
                }
            }
        }

        getUser(localStorage.getItem('token'))
    }, [])

    const maxDate = dayjs().subtract(18, 'year').format('MM/DD/YYYY')
    const minDate = dayjs().subtract(120, 'year').format('MM/DD/YYYY')

    const initialValues : EditProfileValues = {
        profilePicture: undefined,
        firstName: '',
        lastName: '',
        birthDate: null
    }

    const validation = Yup.object({
        profilePicture: Yup.mixed().required('Required'),
        firstName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid First Name').required('Required'),
        lastName: Yup.string().matches(/^[A-Za-z ]*$/, 'Please Enter a Valid Last Name').required('Required'),
        birthDate: Yup.date().max(maxDate, 'Must Be At Least 18 Years Old').min(minDate, 'Invalid Date').required('Required').nullable()
    })

    const onSubmit = async (values: EditProfileValues, { setSubmitting, resetForm, validateForm }: FormikHelpers<EditProfileValues>) => {
    }

    return (<>
                <Formik initialValues={initialValues} validationSchema={validation} onSubmit={onSubmit}>
                    {formik => (
                    <Form>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', paddingTop: '2vh'}}>
                            <Button variant='contained' type='submit' disabled={formik.isSubmitting}> Create Post </Button>
                        </Box>
                    </Form>
                    )}
                </Formik>
                <SubmissionAlert value={userEdits} setValue={setUserEdits}/>
            </>)
}

export default EditProfile