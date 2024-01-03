import { useState } from 'react'
import { _apiClient } from '../../App'
import { ContentModel, MediaType } from '../../api/Client'
import React from 'react'
import { Avatar, Box, Button, Fab, Grid, TextField, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { ErrorMessage, Field, Form, Formik, FormikErrors, FormikHelpers, FormikState } from 'formik'
import * as Yup from 'yup'
import { FormProperties } from '../../utils/FormProperties'
import axios from 'axios'
import SubmissionAlert from '../login-pages/SubmissionAlert'
import useUser from '../../hooks/useUser'

interface ContentPostValues {
    multiMediaContent: File | undefined
    caption: string
}

interface CreatePostProps {
    handleClose: () => void
}

export const CreatePostBox = ( props: CreatePostProps ) => {

    const [ user ] = useUser()
    const [ post, setPost ] = useState<FormProperties>(({
        isOpen: false,
        isSuccess: false,
        message: ''
      }))

    const initialValues: ContentPostValues = {
        multiMediaContent: undefined,
        caption: '',
    }

    const validation = Yup.object({
        multiMediaContent: Yup.mixed().required('Required'),
        caption: Yup.string().required('Required'),
    })

    const onSubmit = async (values: ContentPostValues, { setSubmitting, resetForm, validateForm }: FormikHelpers<ContentPostValues>) => {
        if (!values.caption || !values.multiMediaContent) {
            setPost({
                isOpen: true,
                isSuccess: false,
                message: 'Caption and/or Photo Content Missing!'
            })
            setSubmitting(false)
            return
        }
        const errors: FormikErrors<ContentPostValues>  = await validateForm(values)
        if (errors.caption || errors.multiMediaContent) {
            setPost({
                isOpen: true,
                isSuccess: false,
                message: 'One Or More Fields Are Invalid!'
            })
            setSubmitting(false)
            return
        }
        if (!user){
            setPost({
                isOpen: true,
                isSuccess: false,
                message: 'You Must Be Logged In!'
            })
        }
        try {
            let newContent : ContentModel = {
                caption: values.caption,
                email: user?.email as string,
                mediaType: MediaType._1,
                likes: []
            }
            const contentResponse = await _apiClient.contentPOST(newContent)
            if (!contentResponse.uploadMediaUrl || !contentResponse.id) {
                setPost({
                    isOpen: true,
                    isSuccess: false,
                    message: 'Error When Creating Post!'
                })
                return
            }
            await axios.put(contentResponse.uploadMediaUrl as string, 
                            values.multiMediaContent, 
                            { headers: { 'Content-Type': values.multiMediaContent.type } })
            setPost({
                isOpen: true,
                isSuccess: true,
                message: 'Post Successfully Created!'
            })
            setTimeout(() => 
            { handleSuccessfulClose(resetForm) }, 
            3000)
        }
        catch(err: any) {
            setPost({
                isOpen: true,
                isSuccess: false,
                message: `Error: ${err.message}`
            })
        }
    }

    const handleSuccessfulClose = (resetForm: (nextState?: Partial<FormikState<ContentPostValues>> | undefined) => void) => {
        resetForm()
        if(props?.handleClose)
            props?.handleClose()
    }

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
                                onChange={(e) => {if (e.target.files != null && e.target.files.length > 0) {
                                    formik.setFieldValue('multiMediaContent', e.target.files[0])
                                }}}
                                />
                                <Box sx={{display: 'flex', maxWidth: '90%'}}>
                                    <label htmlFor="multiMediaContent">
                                        <Fab component='span' onClick={() => formik.setFieldTouched('multiMediaContent')}>
                                            <AddPhotoAlternateIcon />
                                        </Fab>
                                    </label>
                                    {formik.errors.multiMediaContent && formik.touched.multiMediaContent 
                                    ? <Typography sx={{margin: '5% 0 0 3%', color: '#D32E2E'}}>{formik.errors.multiMediaContent}</Typography> 
                                    : <Typography sx={{margin: '5% 0 0 3%' }} noWrap={true}>{formik.values.multiMediaContent ? URL.createObjectURL(formik.values.multiMediaContent) : ''}</Typography>}
                                </Box>
                                {formik.values.multiMediaContent ?
                                <img 
                                    style={{marginTop: '2vh', maxWidth: '100%', maxHeight: '50vh'}}
                                    src={URL.createObjectURL(formik.values.multiMediaContent)}
                                    srcSet={URL.createObjectURL(formik.values.multiMediaContent)}
                                    alt={URL.createObjectURL(formik.values.multiMediaContent)}
                                /> : <></>}

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
                <SubmissionAlert value={post} setValue={setPost}/>
            </>)
}

export default CreatePostBox