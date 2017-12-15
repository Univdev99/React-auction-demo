import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { Alert, Button, Row, Col } from 'reactstrap'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import RichEditorField from 'components/RichEditorField'


class CharityForm extends PureComponent {

  static propTypes = {
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
    const { error, handleSubmit, initialValues, onBack, renderMediaDropzone, submitFailed, submitting } = this.props

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || `Failed to ${initialValues.get('title') ? 'update the' : 'create a'} charity`}
        </Alert>}

        <div className="bordered-box no-bottom-padding">
          <Row>
            <Col md={4} xs={12}>
              <FormField
                name="title"
                type="text"
                label="Charity Name"
                component={InputField}
              />
            </Col>
            <Col md={4} xs={12}>
              <FormField
                name="contact"
                type="text"
                label="Contact"
                component={InputField}
              />
            </Col>
            <Col md={4} xs={12}>
              <FormField
                name="phone"
                type="text"
                label="Phone #"
                component={InputField}
              />
            </Col>
          </Row>
          <Row>
            <Col md={8} xs={12}>
              <FormField
                name="address"
                type="text"
                label="Address"
                component={InputField}
              />
            </Col>
            <Col md={4} xs={12}>
              {renderMediaDropzone && renderMediaDropzone()}
            </Col>
          </Row>
        </div>

        <div className="mt-4 text-right">
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

  return errors
}

export default compose(
  reduxForm({
    form: 'charityForm',
    validate,
  })
)(CharityForm)
