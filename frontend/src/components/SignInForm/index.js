import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import FormGroup from 'components/FormGroup'
import InputField from 'components/InputField'

class SignInForm extends PureComponent {
  render() {
    const { handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup
          name="username"
          type="text"
          label="Username:"
          component={InputField}
        />
        <FormGroup
          name="password"
          type="password"
          label="Password:"
          component={InputField}
        />
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    )
  }
}

SignInForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default compose(
  reduxForm({
    form: 'signInForm',
  })
)(SignInForm)