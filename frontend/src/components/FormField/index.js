import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form/immutable'


class FormField extends PureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    component: PropTypes.func.isRequired,
    validate: PropTypes.func,
  }

  render() {
    const { name, label, component, type, validate } = this.props

    return (
      <Field name={name} component={component} type={type} validate={validate} props={{ label }} />
    )
  }
}

export default FormField