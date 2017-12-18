import React from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import IconArrowRight from 'icons/IconArrowRight'


const ArrowLink = ({ to, className, text, ...extraProps }) => {
  const outside = to && to.startsWith('http')
  const Tag = outside ? 'a' : Link
  return (
    <Tag
      to={outside ? undefined : to}
      href={outside ? to : undefined}
      className={cx('arrow-link', className)}
      {...extraProps}
    >
      <span className="mr-2 align-middle">{text}</span>
      <IconArrowRight />
    </Tag>
  )
}

export default ArrowLink
