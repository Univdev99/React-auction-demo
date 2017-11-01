import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Label, Input, FormFeedback, FormGroup, FormText } from 'reactstrap'


class TextareaField extends PureComponent {

  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    type: PropTypes.string,
    label: PropTypes.string,
    helpText: PropTypes.string,
    placeholder: PropTypes.string
  }

  render() {
    const {
      input,
      meta: { error, touched },
      label,
      helpText,
      placeholder
    } = this.props
    const { name } = input
    const fieldError = touched && error

    return (
      <FormGroup>
        {label && <Label htmlFor={name}>{label}</Label>}
        <Input type="textarea" {...input} placeholder={placeholder} valid={fieldError ? false : undefined} rows={5} />
        {fieldError && <FormFeedback>{error}</FormFeedback>}
        {helpText && !fieldError && <FormText>{helpText}</FormText>}
      </FormGroup>
    )
  }
}

export default TextareaField
