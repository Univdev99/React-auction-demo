import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { NavbarBrand } from 'reactstrap'


class AppLogo extends PureComponent {
  static propTypes = {
    color: PropTypes.string
  }

  render() {
    const { color, ...props } = this.props
    const logo = color ? `logo-${color}` : `logo`

    return (
      <NavbarBrand tag={Link} to="/" {...props}>
        <img src={`/${logo}.svg`} height="48" className="align-top" alt="yuma" />
      </NavbarBrand>
    )
  }
}

export default AppLogo
