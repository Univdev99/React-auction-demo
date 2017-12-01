import React from 'react'
import cx from 'classnames'
import { Button } from 'reactstrap'

import IconArrowRight from 'icons/IconArrowRight'


const ArrowButton = ({ className, text, ...props }) => (
  <Button
    className={cx('arrow-button', className)}
    color="secondary"
    outline
    {...props}
  >
    <span className="mr-2 align-middle">{text}</span>
    <IconArrowRight />
  </Button>
)

export default ArrowButton
