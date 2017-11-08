import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Fields } from 'redux-form/immutable'
import {
  FormGroup, FormText, Label, FormFeedback,
  InputGroup, InputGroupButton, Input,
} from 'reactstrap'

import ChoiceDropdown from './ChoiceDropdown'


class InputGroupFormField extends PureComponent {

  static propTypes = {
    valueName: PropTypes.string.isRequired,
    choiceName: PropTypes.string.isRequired,
    choices: PropTypes.array.isRequired,
    label: PropTypes.string,
    helpText: PropTypes.string,
    placeholder: PropTypes.string,
    validate: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func
    ]),
  }

  renderInputGroup = (fields) => {
    const { valueName, choiceName, choices, label, helpText } = this.props
    const { touched: valueTouched, error: valueError } = fields[valueName]
    const { touched: choiceTouched, error: choiceError } = fields[choiceName]
    const error = valueError || choiceError
    const fieldError = (valueTouched || choiceTouched) && error

    return (
      <FormGroup>
        {label && <Label>{label}</Label>}
        <InputGroup>
          <Input {...fields[valueName].input} />
          <InputGroupButton>
            <ChoiceDropdown
              choices={choices}
              value={fields[choiceName].input.value}
              onSelect={fields[choiceName].input.onChange}
            />
          </InputGroupButton>
        </InputGroup>
        {fieldError && <FormFeedback>{error}</FormFeedback>}
        {helpText && !fieldError && <FormText>{helpText}</FormText>}
      </FormGroup>
    )
  }

  render() {
    const { valueName, choiceName, validate, placeholder } = this.props

    return (
      <Fields
        names={[valueName, choiceName]}
        component={this.renderInputGroup}
        validate={validate}
        props={{ placeholder }}
      />
    )
  }
}

export default InputGroupFormField
