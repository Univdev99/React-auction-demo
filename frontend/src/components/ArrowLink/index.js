import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import IconArrowRight from 'icons/IconArrowRight'


const ArrowLink = ({ to, className, text }) => (
  <Link
    to={to}
    className={cx('arrow-link', className)}
  >
    <span className="mr-2 align-middle">{text}</span>
    <IconArrowRight />
  </Link>
)

export default ArrowLink
