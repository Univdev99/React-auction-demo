import React from 'react'
import cx from 'classnames'

const IconListItem = ({ icon, children }) => (
  <div className="d-flex mb-3">
  	<div className="align-self-center mr-3 text-secondary">
  		<i className={cx('fa', icon)} style={{ fontSize: '3rem' }} />
  	</div>
    <div className="align-self-center">{children}</div>
  </div>
)

export default IconListItem
