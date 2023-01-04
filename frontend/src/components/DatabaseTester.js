import { useState } from 'react'
import axios from 'axios'
import { GETEndPoint } from '../utils/validation.constants'

import './DatabaseTester.css'


export const DatabaseTester = () => {
    const [value, setValue] = useState("Database Not Connected")

    return (
        <>
            <button className = "DatabaseTester"
            onClick = {() => {
                axios.get(GETEndPoint)
                    .then(response => {
                        setValue(response.data)
                    })
                    .catch(error => {
                        setValue("Error: Could Not Connect")
                            console.error(error)
                    })
                }
            }>
                Click
            </button>
            <p> {value}
            </p>
        </>
    )
}