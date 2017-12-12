import React from 'react'
import cx from 'classnames'

import ArrowLink from 'components/ArrowLink'
import SectionTitle from 'components/SectionTitle'


const COMPONENT_CLASS = 'section'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`
const bemM = (suffix) => `${COMPONENT_CLASS}--${suffix}`

const Section = ({ children, className, title, titleCenter, link, linkText, mbResponsive }) => (
  <div className={cx(COMPONENT_CLASS, { [bemM('mb-mobile')]: mbResponsive }, className)}>
    {title &&
      <div
        className={cx(bem('header'), {
          'justify-content-center': !!titleCenter && !link,
        })}>
        <SectionTitle noMargin>{title}</SectionTitle>
        {link && linkText && <ArrowLink className="d-none d-md-inline-block" to={link} text={linkText} />}
      </div>
    }
    {children}
    {link && linkText && <div className={bem('footer')}>
      <ArrowLink to={link} text={linkText} />
    </div>}
  </div>
)

export default Section
