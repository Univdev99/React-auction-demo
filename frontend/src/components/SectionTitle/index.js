import React from 'react'
import cx from 'classnames'

const SectionTitle = ({ children, className }) => (
  <h3 className={cx('text-uppercase', className)}>{children}</h3>
)

export default SectionTitle
