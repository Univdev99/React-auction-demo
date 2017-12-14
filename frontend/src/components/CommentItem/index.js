import React from 'react'
import { FormattedDate } from 'react-intl'

import UserAvatar from 'components/UserAvatar'


const COMPONENT_CLASS = 'comment-item'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const CommentItem = ({ comment }) => (
  <div className={COMPONENT_CLASS}>
    <UserAvatar user={comment.get('user')} type="comment" />
    <div className={bem('content')}>
      <div>
        <h5 className="d-inline-block mr-2">{comment.getIn(['user', 'full_name'])}</h5>
        <FormattedDate value={comment.get('created_at')} format="dayMonthAndYear" />
      </div>
      <div>{comment.get('content')}</div>
    </div>
  </div>
)

export default CommentItem
