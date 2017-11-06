import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import MaskedInput from 'react-maskedinput'
import { Label, FormFeedback, FormGroup, FormText } from 'reactstrap'


class MaskedInputField extends PureComponent {

  static propTypes = {
    helpText: PropTypes.string,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    mask: PropTypes.string.isRequired,
    meta: PropTypes.object.isRequired,
    placeholder: PropTypes.string
  }

  render() {
    const {
      helpText,
      input,
      label,
      meta: { error, touched },
      placeholder,
      mask
    } = this.props
    const { name } = input
    const fieldError = touched && !!error

    return (
      <FormGroup>
        {label && <Label htmlFor={name}>{label}</Label>}
        <MaskedInput mask={mask} {...input} placeholder={placeholder}
          className={cx('form-control', { 'is-invalid': fieldError })} />
        {fieldError && <FormFeedback>{error}</FormFeedback>}
        {helpText && !fieldError && <FormText>{helpText}</FormText>}
      </FormGroup>
    )
  }
}

export default MaskedInputField
