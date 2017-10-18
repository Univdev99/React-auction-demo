import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import TextareaField from 'components/TextareaField'


class CharityForm extends PureComponent {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  render() {
    const { handleSubmit, disabled } = this.props
    return (
      <form onSubmit={handleSubmit}>
        <FormField
          name="title"
          type="text"
          label="Title:"
          component={InputField}
        />
        <FormField
          name="description"
          type="text"
          label="Description:"
          component={TextareaField}
        />
        <center>
          <button type="submit" className="btn btn-primary" disabled={disabled}>Update</button>
        </center>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.get('title')) {
    errors.title = 'Title is required'
  }

  if (!values.get('description')) {
    errors.description = 'Description is required'
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'charityForm',
    validate,
  })
)(CharityForm)