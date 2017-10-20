import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import TextareaField from 'components/TextareaField'


class CharityForm extends PureComponent {

  static propTypes = {
    initialValues: ImmutablePropTypes.map,
    disabled: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func,
  }

  handleClickBack = (e) => {
    e.preventDefault()

    const { onBack } = this.props
    if (onBack) {
      onBack()
    }
  }

  render() {
    const { initialValues, disabled, handleSubmit, onBack } = this.props

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
          {onBack && <button className="btn mr-3" onClick={this.handleClickBack}>
            Back
          </button>}
          <button type="submit" className="btn btn-primary" disabled={disabled}>
            {initialValues ? 'Update' : 'Create'}
          </button>
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