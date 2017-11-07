import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Row, Col } from 'reactstrap'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import TagsInputField from 'components/TagsInputField'
import TextareaField from 'components/TextareaField'
import SelectField from 'components/SelectField'


class ProductForm extends PureComponent {

  static propTypes = {
    initialValues: ImmutablePropTypes.map,
    disabled: PropTypes.bool,
    donorList: ImmutablePropTypes.list.isRequired,
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
    const { initialValues, donorList, disabled, renderMediaDropzone, handleSubmit, onBack } = this.props

    return (
      <form onSubmit={handleSubmit}>
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
              type="text"
              label="Description:"
              component={TextareaField}
            />
          </Col>
          <Col md="4" sm="12" className="mb-4">
            <FormField
              name="donor"
              label="Donor:"
              component={SelectField}
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

        <Row>
          <Col md="8" sm="12" className="mb-4">
            {renderMediaDropzone && renderMediaDropzone()}
          </Col>
        </Row>

        <div className="text-right">
          {onBack && <button className="btn mr-3 px-4" onClick={this.handleClickBack}>
            Back
          </button>}
          <button type="submit" className="btn btn-primary px-4" disabled={disabled}>
            {initialValues ? 'Update' : 'Create'}
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

  if (!values.get('description')) {
    errors.description = 'Description is required'
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