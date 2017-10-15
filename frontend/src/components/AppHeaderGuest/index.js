import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

class AppHeaderGuest extends PureComponent {

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <span className="navbar-brand">Charibin</span>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">Home</Link>
            </li>
          </ul>
          <Link className="navbar-text pr-3" to="/signin">
            Sign In
          </Link>
          <Link className="navbar-text" to="/signup">
            Sign Up
          </Link>
        </div>
      </nav>
    )
  }
}

export default AppHeaderGuest
