import React from 'react'

import ArrowLink from 'components/ArrowLink'
import SectionTitle from 'components/SectionTitle'


const COMPONENT_CLASS = 'section'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const Section = ({ children, title, link, linkText }) => (
  <div className={COMPONENT_CLASS}>
    {title && <div className={bem('header')}>
      <SectionTitle>{title}</SectionTitle>
      {link && linkText && <ArrowLink className="d-none d-md-inline-block" to={link} text={linkText} />}
    </div>}
    {children}
    {link && linkText && <div className={bem('footer')}>
      <ArrowLink to={link} text={linkText} />
    </div>}
  </div>
)

export default Section
