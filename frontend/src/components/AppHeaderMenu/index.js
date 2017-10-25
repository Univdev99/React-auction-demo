import React from 'react'
import { Link } from 'react-router-dom'


const AppHeaderMenu = () => (
  <ul className="navbar-nav ml-auto">
    <li className="nav-item">
      <Link className="nav-link" to="/">Auctions</Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/">Mission</Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/">FAQ</Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/">The Good</Link>
    </li>
  </ul>
)

export default AppHeaderMenu
