import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import TagsInputField from 'components/TagsInputField'
import TextareaField from 'components/TextareaField'
import SelectField from 'components/SelectField'
import { DONOR_TYPES } from 'config'


class DonorForm extends PureComponent {

  static propTypes = {
    initialValues: ImmutablePropTypes.map,
    disabled: PropTypes.bool,
    charityList: ImmutablePropTypes.list.isRequired,
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
    const { initialValues, charityList, disabled, handleSubmit, onBack } = this.props

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
        <FormField
          name="type"
          label="Type:"
          component={SelectField}
          options={DONOR_TYPES}
        />
        <FormField
          name="charity"
          label="Charity:"
          component={SelectField}
          options={charityList.map(charity => ({
            key: charity.get('pk'),
            value: charity.get('title'),
          }))}
        />
        <FormField
          name="tagnames"
          label="Tags:"
          component={TagsInputField}
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

  if (!values.get('type')) {
    errors.type = 'Please select donor type'
  }

  if (!values.get('charity')) {
    errors.charity = 'Please select a charity'
  }

  if (!values.get('tagnames') || !values.get('tagnames').size) {
    errors.tagnames = 'Please enter at least one tag'
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'donorForm',
    validate,
  })
)(DonorForm)