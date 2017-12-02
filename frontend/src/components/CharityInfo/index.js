import React from 'react'


const COMPONENT_CLASS = 'charity-info'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const CharityInfo = ({ charity }) => (
  <div className={COMPONENT_CLASS}>
    <div className={bem('label')}>They Support</div>
    <div className={bem('logo')}>
      <img src={charity.logo} alt={charity.title} />
    </div>
  </div>
)

export default CharityInfo
