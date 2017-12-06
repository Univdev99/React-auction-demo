import React from 'react'
import cx from 'classnames'
import { Label, FormFeedback, FormGroup, FormText } from 'reactstrap'

import Slider from 'components/Slider'
import { sanitizeFormError } from 'utils/form'


const SliderField = ({
  helpText,
  input,
  label,
  meta: { error, touched },
  ...props
}) => (
  <FormGroup>
    {label && <Label>{label}</Label>}
    <Slider
      value={input.value}
      onChange={input.onChange}
      {...props}
    />
    <div
      className={cx('form-control', 'd-none', {
        'is-invalid': touched && error
      })}
    />
    {touched && error && <FormFeedback>{sanitizeFormError(error)}</FormFeedback>}
    {helpText && !(touched && error) && <FormText>{helpText}</FormText>}
  </FormGroup>
)

export default SliderField
