import React, { PureComponent } from 'react'
import cx from 'classnames'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { Field, reduxForm } from 'redux-form/immutable'

import UserAvatar from 'components/UserAvatar'
import TextareaField from 'components/TextareaField'


const COMPONENT_CLASS = 'comment-item'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`
const bemM = (suffix) => `${COMPONENT_CLASS}--${suffix}`

const isRequired = value => (value ? undefined : 'Your comment is required')

class CommentForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    user: ImmutablePropTypes.map
  }

  render() {
    const { handleSubmit, submitting, user } = this.props

    return (
      <div className={cx(COMPONENT_CLASS, bemM('border'))}>
        <UserAvatar user={user} type="comment" />
        <div className={bem('content')}>
          <form onSubmit={handleSubmit}>
            <Field
              name="content"
              label="Your Comment:"
              type="textarea"
              validate={[isRequired]}
              component={TextareaField}
            />
            <div className="text-right">
              <Button type="submit" color="primary" disabled={submitting}>Submit Comment</Button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'commentForm'
})(CommentForm)
