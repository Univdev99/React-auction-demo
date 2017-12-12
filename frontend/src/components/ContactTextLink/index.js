import React from 'react'
import { Link } from 'react-router-dom'

export default ({ text }) => (
  <h4 className="my-50 my-md-80 text-center">
    {text || 'Do you have any questions?'}
    {' '}
    <span className="d-inline-block">
      <Link to="/support">Contact us</Link>
    </span>
  </h4>
)
