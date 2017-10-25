import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import AppHeaderMenu from 'components/AppHeaderMenu'


class AppHeaderGuest extends PureComponent {

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <span className="navbar-brand">Charibin</span>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <AppHeaderMenu />

          <Link className="navbar-text ml-3" to="/signin">
            <i className="fa fa-user-circle" />
          </Link>
        </div>
      </nav>
    )
  }
}

export default AppHeaderGuest
