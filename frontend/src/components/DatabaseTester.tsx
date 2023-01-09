import { useState } from 'react'
import { TestApiClient } from '../api_views/TestApiClient'
import { GETEndPoint } from '../utils/Constants'

import './DatabaseTester.css'
import React from 'react'

export interface IProps {
    value : string
}

export const DatabaseTester = (props: IProps) => {
    const [value, setValue] = useState<string>(props.value)
    const apiClient = new TestApiClient(GETEndPoint)

    return (
        <>
            <button className = "DatabaseTester"
            onClick = {async () => {
                try{
                    setValue(await apiClient.getMessage())
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