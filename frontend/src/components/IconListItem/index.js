import React from 'react'
import cx from 'classnames'

const COMPONENT_CLASS = 'icon-list-item'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const IconListItem = ({ image, icon: Icon, children }) => (
  <div className={COMPONENT_CLASS}>
  	<div
      className={cx({
        [bem('image')]: !!image,
        [bem('icon')]: !!Icon
      })}
    >
      {image && <img src={image} alt="" />}
      {Icon && <Icon size={20} />}
  	</div>
    <div className="align-self-center">{children}</div>
  </div>
)

export default IconListItem
