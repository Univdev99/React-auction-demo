import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Alert, Button, Row, Col } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import TagsInputField from 'components/TagsInputField'
import RichEditorField from 'components/RichEditorField'
import InputGroupFormField from 'components/InputGroupFormField'
import { PRODUCT_WEIGHT_UNIT_CHOICES } from 'config'


class ProductForm extends PureComponent {

  static propTypes = {
    donorList: ImmutablePropTypes.list.isRequired,
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: ImmutablePropTypes.map,
    onBack: PropTypes.func,
    mediaDropzone: PropTypes.any,
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
    const { donorList, error, handleSubmit, initialValues, onBack, mediaDropzone,
      submitFailed, submitting } = this.props

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || `Failed to ${initialValues.get('title') ? 'update the' : 'create a'} product`}
        </Alert>}

        <div className="bordered-box no-bottom-padding">
          <Row>
            <Col md="8" sm="12">
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
              
              {mediaDropzone}
            </Col>
            <Col md="4" sm="12">
              <FormField
                name="charge_tax"
                type="checkbox"
                label="Charge taxes on this product"
                component={InputField}
              />
              <h6>Shipping</h6>
              <FormField
                name="requires_shipping"
                type="checkbox"
                label="This product requires shipping"
                component={InputField}
              />
              <InputGroupFormField
                valueName="weight"
                choiceName="weight_unit"
                label="Product weight"
                choices={PRODUCT_WEIGHT_UNIT_CHOICES}
              />
              <FormField
                name="hs_tariff_code"
                label="HS tariff code (for international customers):"
                component={InputField}
              />
              <FormField
                name="donor"
                label="Donor:"
                type="select"
                component={InputField}
                options={donorList.map(donor => ({
                  key: donor.get('pk'),
                  value: donor.get('title'),
                }))}
              />
              <FormField
                name="tagnames"
                label="Tags:"
                component={TagsInputField}
              />
            </Col>
          </Row>
        </div>

        <div className="text-right mt-4">
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

  if (!values.get('donor')) {
    errors.donor = 'Please select a donor'
  }

  if (!values.get('tagnames') || !values.get('tagnames').size) {
    errors.tagnames = 'Please enter at least one tag'
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'productForm',
    validate,
  })
)(ProductForm)