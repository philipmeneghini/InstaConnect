import { useState } from 'react'
import axios from 'axios'
import { GETEndPoint } from '../utils/validation.constants'

import './DatabaseTester.css'
import React from 'react'

export interface IProps {
    value : string
}

export const DatabaseTester = (props: IProps) => {
    const [value, setValue] = useState<string>(props.value)

    return (
        <>
            <button className = "DatabaseTester"
            onClick = {async () => {
                try{
                    const response = await axios.get(GETEndPoint)
                    setValue(response.data)
                }
                catch(error: any) {
                    setValue(`Error: ${error.data}`)
                    console.error(error)
                }
                }
            }>
                Click
            </button>
            <p> {value}
            </p>
        </>
    )
}