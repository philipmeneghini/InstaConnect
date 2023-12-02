import {Alert, AlertColor, Snackbar} from '@mui/material'
import React from 'react'
import { FormProperties } from '../../utils/FormProperties'

interface AlertProps {
  value: FormProperties,
  setValue: React.Dispatch<React.SetStateAction<FormProperties>>
}

export const SubmissionAlert = (props: AlertProps) => {

  const handleClose = () => {
    props.setValue({
      ...props.value,
      isOpen: false
    })
  }

  const handleSeverity = () => {
    if(props.value.isSuccess) {
      return 'success' as AlertColor
    }
    else {
      return 'error' as AlertColor
    }
  }

  return (
    <Snackbar
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} 
      open={props.value.isOpen} 
      autoHideDuration={6000} 
      onClose={handleClose}
      key={'bottomcenter'}
      >
        <Alert severity={handleSeverity()} sx={{ width: '100%' }}>
          {props.value.message}
        </Alert>
    </Snackbar>
  )
}

export default SubmissionAlert