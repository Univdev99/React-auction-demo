import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form/immutable'


class FormField extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    component: PropTypes.func.isRequired,
    helpText: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    options: PropTypes.any,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    validate: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func
    ]),
  }

  render() {
    const { name, label, helpText, children, component, type, validate, options, placeholder } = this.props

    return (
      <Field name={name} component={component} type={type} validate={validate}
        props={{ children, label, helpText, options, placeholder }} />
    )
  }
}

export default FormField
