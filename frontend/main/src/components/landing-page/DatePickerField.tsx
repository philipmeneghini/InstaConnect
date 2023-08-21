import { DatePicker, DateValidationError } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useFormikContext } from "formik"
import React from "react"
import { useMemo, useState } from "react"

interface NameProp {
    name: any
}

export const DatePickerField = (prop: NameProp) => {
    const formik = useFormikContext()
    const [ error, setError ] = useState<DateValidationError | null>(null)
    const field = formik.getFieldProps(prop.name)

    const errorMessage = useMemo(() => {
        switch (error) {
          case 'maxDate': {
            return 'you must be at least 18 years old'
          }
          case 'minDate': {
            return 'invalid date'
          }
    
          case 'invalidDate': {
            return 'invalid date'
          }
    
          default: {
            return ''
          }
        }
      }, [error])

    const maxDate = dayjs().subtract(18, 'year')
    const minDate = dayjs().subtract(120, 'year')

    const formikChange = (value: any) => {
        formik.setFieldValue(prop.name, value)
        formik.setFieldTouched(prop.name)
    }

    const processError = (error: DateValidationError): void => {
        setError(error)
        formik.setFieldError(prop.name, errorMessage)
    }
  
    return (
      <DatePicker
        value={field.value}
        onChange={value => formikChange(value)}
        disableFuture
        minDate={minDate}
        maxDate={maxDate}
        sx={{width:'380px'}}
        onError={(error) => processError(error)}
        slotProps={{
            textField: {
                helperText: errorMessage
            }
        }}
      />
    )
}

export default DatePickerField