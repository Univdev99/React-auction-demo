import React from 'react'
import cx from 'classnames'
import { Button } from 'reactstrap'


const MoreButton = ({ className, text, ...props }) => (
  <Button
    className={cx('more-button', className)}
    color="secondary"
    outline
    {...props}
  >
    {text}
  </Button>
)

export default MoreButton
