import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Label, Input, FormFeedback, FormGroup, FormText } from 'reactstrap'


class InputField extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    helpText: PropTypes.string,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string
  }

  static defaultProps = {
    type: 'text',
  }

  render() {
    const {
      children,
      helpText,
      input,
      label,
      meta: { error, touched },
      placeholder,
      type
    } = this.props
    const { name } = input
    const fieldError = touched && error

    return (
      <FormGroup>
        {label && <Label htmlFor={name}>{label}</Label>}
        <Input type={type} {...input} placeholder={placeholder}
          valid={fieldError ? false : undefined} children={children} />
        {fieldError && <FormFeedback>{error}</FormFeedback>}
        {helpText && !fieldError && <FormText>{helpText}</FormText>}
      </FormGroup>
    )
  }
}

export default InputField
