import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import RichEditorField from 'components/RichEditorField'


class CharityForm extends PureComponent {

  static propTypes = {
    initialValues: ImmutablePropTypes.map,
    disabled: PropTypes.bool,
    renderMediaDropzone: PropTypes.func,
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
    const { initialValues, disabled, renderMediaDropzone, handleSubmit, onBack } = this.props

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
          label="Description:"
          component={RichEditorField}
        />
        <div className="mb-4">
          {renderMediaDropzone && renderMediaDropzone()}
        </div>
        <div className="text-right">
          {onBack && <button className="btn mr-3 px-4" onClick={this.handleClickBack}>
            Back
          </button>}
          <button type="submit" className="btn btn-primary px-4" disabled={disabled}>
            {initialValues.get('title') ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.get('title')) {
    errors.title = 'Title is required'
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'charityForm',
    validate,
  })
)(CharityForm)