import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Fab, Grid, TextField, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

interface ContentPostValues {
    multiMediaContent: string
    caption: string
}

interface CreatePostProps {
    handleClose: () => void
}

export const CreatePostBox = ( props: CreatePostProps ) => {

    const [ user, setUser ] = useState<UserModel>()
    const [ error, setError ] = useState<string | undefined>()

    useEffect(() => {
        const getUserContents = async(jwt: string | null | undefined) => {
            if (jwt) {
                try {
                    const jwtResponse = await _apiClient.verifyToken(jwt)
                    const user = await _apiClient.userGET(jwtResponse.email)
                    setUser(user)
                }
                catch(err: any) {
                    setError(err.message)
                    setUser(undefined)
                }
            }
            else {
                setError('No valid jwt token in local storage')
            }
        }
        getUserContents(localStorage.getItem('token'))
    }, [])

    const initialValues: ContentPostValues = {
        multiMediaContent: '',
        caption: '',
    }

    const validation = Yup.object({
        multiMediaContent: Yup.string().required('Required'),
        caption: Yup.string().required('Required'),
    })

    const onSubmit = () => { }

    return (<>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', marginLeft: '2%'}}>
                        <Avatar src={user?.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                            <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {user?.firstName} {user?.lastName} </Typography>
                    </Box>
                    <Button variant='contained' onClick={props?.handleClose}> Close </Button>
                </Box>
                <Formik initialValues={initialValues} validationSchema={validation} onSubmit={onSubmit}>
                    {formik => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <input
                                style={{display: 'none'}}
                                accept='image/*'
                                id='multiMediaContent'
                                name='multiMediaContent'
                                type='file'
                                onChange={(e) => {if (e.target.files != null) {
                                    formik.setFieldValue('multiMediaContent', URL.createObjectURL(e.target.files[0]))
                                }}}
                                />
                                <Box sx={{display: 'flex', maxWidth: '90%'}}>
                                    <label htmlFor="multiMediaContent">
                                        <Fab component='span' onClick={() => formik.setFieldTouched('multiMediaContent')}>
                                            <AddPhotoAlternateIcon />
                                        </Fab>
                                    </label>
                                    {formik.errors.multiMediaContent && formik.touched.multiMediaContent 
                                    ? <Typography sx={{marginLeft: '3%', color: 'red'}}>{formik.errors.multiMediaContent}</Typography> 
                                    : <Typography sx={{marginLeft: '3%', maxWidth: '60%'}} noWrap={true}>{formik.values.multiMediaContent}</Typography>}
                                </Box>
                                <img 
                                    style={{marginTop: '2vh', maxWidth: '100%', maxHeight: '50vh'}}
                                    src={formik.values.multiMediaContent}
                                    srcSet={formik.values.multiMediaContent}
                                    alt={formik.values.multiMediaContent}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Field as={TextField} 
                                label='Caption' 
                                name='caption' 
                                placeholder='Enter a caption'
                                multiline 
                                fullWidth required
                                error={formik.errors.caption && formik.touched.caption ? true : false}
                                helperText={<ErrorMessage name='caption'/>}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', paddingTop: '2vh'}}>
                            <Button variant='contained' type='submit' disabled={formik.isSubmitting}> Create Post </Button>
                        </Box>
                    </Form>
                    )}
                </Formik>
            </>)
}

export default CreatePostBox