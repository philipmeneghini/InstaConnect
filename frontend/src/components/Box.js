import REACT from 'react'
import axios from 'axios'

import "./Box.css"

export default class Box extends REACT.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: "Click",
        }
    }

    render() {
        console.log(this.state.value)
        return (
            <>
                <button
                className = "Box"
                onClick = {this.getDB}>
                    "Click"
                </button>
                <p> {this.state.value.test}
                </p>
            </>
        )
    }

    sayHello = () => {
        alert('You clicked me')
    }

    getDB = () => {
        axios.get(`https://localhost:7208/InstaConnect`)
        .then(response => {
            this.setState({value: response.data})
        })
        .catch(error => {
            this.setState({value: "Error"})
            console.error(error)
        })
    }
}