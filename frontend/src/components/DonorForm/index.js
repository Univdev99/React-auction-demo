import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { Alert, Button } from 'reactstrap'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Row, Col } from 'reactstrap'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import ListField from 'components/ListField'
import TextareaField from 'components/TextareaField'
import TagsInputField from 'components/TagsInputField'
import RichEditorField from 'components/RichEditorField'
import { DONOR_TYPES } from 'config'


class DonorForm extends PureComponent {

  static propTypes = {
    charityList: ImmutablePropTypes.list.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: ImmutablePropTypes.map,
    onBack: PropTypes.func,
    renderMediaDropzone: PropTypes.func,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  handleClickBack = (e) => {
    e.preventDefault()

    const { onBack } = this.props
    if (onBack) {
      onBack()
    }
  }

  render() {
    const { error, charityList, handleSubmit, initialValues, onBack, renderMediaDropzone,
      submitFailed, submitting } = this.props

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || `Failed to ${initialValues.get('title') ? 'update the' : 'create a'} donor`}
        </Alert>}

        <Row>
          <Col md="8" sm="12" className="mb-4">
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
            {renderMediaDropzone && renderMediaDropzone()}
          </Col>
          <Col md="4" sm="12" className="mb-4">
            <FormField
              name="type"
              label="Type:"
              type="select"
              component={InputField}
              options={DONOR_TYPES}
            />
            <FormField
              name="charity_ids"
              label="Charities:"
              component={ListField}
              options={charityList}
              getTitle={charity => charity.get('title')}
            />
            <FormField
              name="instagram_handle"
              label="Instagram:"
              type="text"
              component={InputField}
            />
            <FormField
              name="website"
              label="Website:"
              type="text"
              component={TextareaField}
            />
            <FormField
              name="tagnames"
              label="Tags:"
              component={TagsInputField}
            />
          </Col>
        </Row>

        <div className="text-right">
          {onBack && <Button className="mr-3 px-4" onClick={this.handleClickBack}>
            Back
          </Button>}
          <Button type="submit" color="primary" className="px-4" disabled={submitting}>
            {initialValues.get('title') ? 'Update' : 'Create'}
          </Button>
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
