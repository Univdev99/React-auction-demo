import React from 'react'
import cx from 'classnames'
import { Label, FormFeedback, FormGroup, FormText } from 'reactstrap'

import Select from 'components/Select'
import { sanitizeFormError } from 'utils/form'


const SelectField = ({
  helpText,
  input,
  label,
  meta: { error, touched },
  size,
  ...props
}) => (
  <FormGroup>
    {label && <Label>{label}</Label>}
    <Select
      {...input}
      size={size}
      valid={touched && error ? false : undefined}
      {...props}
    />
    <div
      className={cx('custom-select', 'd-none', {
        'is-invalid': touched && error
      })}
    />
    {touched && error && <FormFeedback>{sanitizeFormError(error)}</FormFeedback>}
    {helpText && !(touched && error) && <FormText>{helpText}</FormText>}
  </FormGroup>
)

export default SelectField
