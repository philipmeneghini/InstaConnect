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
        return (
            <button
            className = "Box"
            onClick = {this.getDB}>
                {this.state.value}
            </button>
        )
    }

    sayHello = () => {
        alert('You clicked me')
    }

    getDB = () => {
        axios.get(`https://localhost:7208/InstaConnect`)
        .then(response => {
            const test = response.data
            this.setState({test})
        })
        .catch(error => {
            this.setState({value: "Error"})
            console.error(error)
        })
    }
}