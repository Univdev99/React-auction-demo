import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Label } from 'reactstrap'
import classnames from 'classnames'

import InputField from 'components/InputField'
import {
  POST_VISIBILITY_PUBLIC,
  POST_VISIBILITY_PROTECTED,
  POST_VISIBILITY_PRIVATE,
} from 'config'


class VisibilityFields extends PureComponent {

  static propTypes = {
    visibility: PropTypes.object,
    is_sticky: PropTypes.object,
    password: PropTypes.object,
  }

  render() {
    const { visibility, is_sticky, password } = this.props

    return (
      <FormGroup tag="fieldset">
        <Label>Visibility</Label>
        <InputField
          type="radio"
          radioValue={POST_VISIBILITY_PUBLIC}
          label="Public"
          {...visibility}
        />
        <div
          className={classnames({
            'mb-3 ml-4': true,
            'd-none': visibility.input.value !== POST_VISIBILITY_PUBLIC
          })}
        >
          <InputField
            type="checkbox"
            label="Stick this post to the front page"
            {...is_sticky}
          />
        </div>
        <InputField
          type="radio"
          radioValue={POST_VISIBILITY_PROTECTED}
          label="Password protected"
          {...visibility}
        />
        <div
          className={classnames({
            'mb-3 ml-4': true,
            'd-none': visibility.input.value !== POST_VISIBILITY_PROTECTED
          })}
        >
          <InputField
            type="password"
            {...password}
          />
        </div>
        <InputField
          type="radio"
          radioValue={POST_VISIBILITY_PRIVATE}
          label="Private"
          {...visibility}
        />
      </FormGroup>
    )
  }
}

export default VisibilityFields
