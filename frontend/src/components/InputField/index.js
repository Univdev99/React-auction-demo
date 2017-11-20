import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Label, Input, FormFeedback, FormGroup, FormText } from 'reactstrap'
import { sanitizeFormError } from 'utils/form'


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
      options,
      placeholder,
      type
    } = this.props
    const { name } = input
    const fieldError = touched && error

    if (type === 'checkbox') {
      return (
        <FormGroup>
          <Label check htmlFor={name}>
            <Input type={type} {...input} placeholder={placeholder}
              valid={fieldError ? false : undefined} children={children} />
            {label}
          </Label>
          {fieldError && <FormFeedback>{sanitizeFormError(error)}</FormFeedback>}
          {helpText && !fieldError && <FormText>{helpText}</FormText>}
        </FormGroup>
      )
    } else {
      return (
        <FormGroup>
          {label && <Label htmlFor={name}>{label}</Label>}
          <Input type={type} {...input} placeholder={placeholder}
            valid={fieldError ? false : undefined} children={children}
          >
            {type === 'select' && options ? [
              <option value={''} key={''}>-- Please select an option --</option>,
              ...options.map(option => (
                <option key={option.key} value={option.key}>{option.value}</option>
              ))
            ] : undefined}
          </Input>
          {fieldError && <FormFeedback>{sanitizeFormError(error)}</FormFeedback>}
          {helpText && !fieldError && <FormText>{helpText}</FormText>}
        </FormGroup>
      )
    }
  }
}

export default InputField
