import React from 'react'

const COMPONENT_CLASS = 'icon-list-item'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const IconListItem = ({ image, children }) => (
  <div className={COMPONENT_CLASS}>
  	<div className={bem('icon')}>
      {image && <img src={image} alt="" />}
  	</div>
    <div className="align-self-center">{children}</div>
  </div>
)

export default IconListItem
