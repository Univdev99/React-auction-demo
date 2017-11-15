import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Input } from 'reactstrap'
import { reduxForm } from 'redux-form/immutable'

import FormField from 'components/FormField'

const renderField = ({
  input,
  meta: { error, touched },
  placeholder
}) => (
  <Input className="mr-2" style={{ flexGrow: 1}}
    type="email" 
    {...input}
    placeholder={placeholder}
    valid={touched && error ? false : undefined}
  />
)

const isRequired = value => (value ? undefined : 'This Field is Required')
const isValidEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined

class SubscribeForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  }

  doSubmit = (data) => {
    console.log(data)
  }

  render() {
    const { handleSubmit, submitting } = this.props

    return (
      <form onSubmit={handleSubmit(this.doSubmit)}
        className="d-flex flex-row mx-auto"
        style={{ maxWidth: 300 }}
      >
        <FormField
          name="email"
          placeholder="Email"
          validate={[isRequired, isValidEmail]}
          component={renderField}
        />
        <Button type="submit" color="primary" disabled={submitting}>Subscribe</Button>
      </form>
    )
  }
}

export default reduxForm({
  form: 'subscribeForm',
  destroyOnUnmount: false
})(SubscribeForm)
