import React from 'react'
import { Button } from 'reactstrap'
import FaFacebook from 'react-icons/lib/fa/facebook'

const COMPONENT_CLASS = 'facebook-button'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const FacebookButton = ({ children, ...props }) => (
  <Button {...props} size="lg" color="facebook" className={COMPONENT_CLASS}>
    <FaFacebook size={20} className={bem('icon')} />
    <span className="align-middle">{children}</span>
  </Button>
)

export default FacebookButton
