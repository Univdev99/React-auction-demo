import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form/immutable'


class FormField extends PureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    helpText: PropTypes.string,
    type: PropTypes.string,
    component: PropTypes.func.isRequired,
    validate: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func
    ]),
    options: PropTypes.any,
  }

  render() {
    const { name, label, helpText, component, type, validate, options } = this.props

    return (
      <Field name={name} component={component} type={type} validate={validate} props={{ label, helpText, options }} />
    )
  }
}

export default FormField
