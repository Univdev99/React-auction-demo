import React, { Component } from 'react'

import logo from './logo.svg'
import './style.css'


class Home extends Component {
  render() {
    return (
      <div className="Home">
        <header className="Home-header">
          <img src={logo} className="Home-logo" alt="logo" />
          <h1 className="Home-title">Welcome to React</h1>
        </header>
        <p className="Home-intro">
          This is home content
        </p>
      </div>
    )
  }
}

export default Home
