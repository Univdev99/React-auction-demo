import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'


class AppLogo extends PureComponent {

  render() {
    return (
      <Link to="/" className="navbar-brand">
        <img src="/logo.svg" width="30" height="30" className="d-inline-block align-top mr-2" alt="Logo" />
        Charibin
      </Link>
    )
  }
}

export default AppLogo
