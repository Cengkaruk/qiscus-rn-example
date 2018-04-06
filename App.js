import React, { Component } from 'react'
import Navigation from './App/Navigation/Navigation'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fontLoaded: false
    }
  }

  render () {
    return (
      <Navigation />
    )
  }
}

export default App
