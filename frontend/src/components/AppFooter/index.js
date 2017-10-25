import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import AppLogo from 'components/AppLogo'


class AppFooter extends PureComponent {

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <AppLogo />
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Privacy Policy</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Terms & Conditions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Shipping</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Support</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Careers</Link>
            </li>
            <li className="nav-item ml-3">
              <a className="nav-link" href="/"><i className="fa fa-facebook-square" /></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/"><i className="fa fa-twitter-square" /></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/"><i className="fa fa-linkedin-square" /></a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default AppFooter
