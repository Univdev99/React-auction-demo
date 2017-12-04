import React from 'react'
import cx from 'classnames'

const SectionTitle = ({ children, className, noMargin }) => (
  <h3 className={cx('text-uppercase', className, { 'mb-0': !!noMargin })}>
    {children}
  </h3>
)

export default SectionTitle
