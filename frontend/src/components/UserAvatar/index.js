import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'

import avatarPlaceholder from 'images/avatar-placeholder.svg'


const COMPONENT_CLASS = 'user-avatar'
const bemM = (suffix) => `${COMPONENT_CLASS}--${suffix}`

const UserAvatar = ({ user, type }) => (
  <div
    className={cx(COMPONENT_CLASS, bemM(type))}
    style={{ backgroundImage: `url(${user.get('avatar') || avatarPlaceholder})` }}
    title={user.get('full_name')}
  />
)

UserAvatar.propTypes = {
  type: PropTypes.oneOf(['comment', 'other']),
}

export default UserAvatar
