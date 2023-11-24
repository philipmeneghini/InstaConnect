import { useEffect, useState } from 'react'
import { _apiClient } from '../../App'
import { UserModel } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Fab, Grid, TextField, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { ErrorMessage, Field, Form, Formik } from 'formik'

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

    const onSubmit = () => { }

    return (<>
                <Box sx={{display:'flex', justifyContent: 'space-between', marginBottom: '2vh'}}>
                    <Box sx={{display:'flex', justifyContent: 'space-between', marginLeft: '2%'}}>
                        <Avatar src={user?.profilePictureUrl} sx={{ width: '5vh', height: '5vh'}}/>
                            <Typography sx={{margin: '0.5vh 0 0.5vh 1vh'}}> {user?.firstName} {user?.lastName} </Typography>
                    </Box>
                    <Button variant='contained' onClick={props?.handleClose}> Close </Button>
                </Box>
                <Formik initialValues={initialValues} onSubmit={onSubmit}>
                    {formik => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <input
                                style={{display: 'none'}}
                                accept='image/*'
                                id='multiMediaContent'
                                name='multiMediaContent'
                                multiple
                                type='file'
                                onChange={formik.handleChange}
                                value={formik.values.multiMediaContent}
                                />
                                <Box sx={{display: 'flex'}}>
                                    <label htmlFor="multiMediaContent">
                                        <Fab component="span">
                                            <AddPhotoAlternateIcon />
                                        </Fab>
                                    </label>
                                    <Typography>{formik.values.multiMediaContent}</Typography>
                                </Box>
                                <img 
                                    src={formik.values.multiMediaContent}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Field as={TextField} 
                                    label='Caption' 
                                    name='caption' 
                                    placeholder='Enter a caption' 
                                    fullWidth required
                                    error={formik.errors.caption && formik.touched.caption ? true : false}
                                    helperText={<ErrorMessage name='caption'/>}
                                />
                            </Grid>
                        </Grid>
                    </Form>
                    )}
                </Formik>
            </>)
}

export default CreatePostBox