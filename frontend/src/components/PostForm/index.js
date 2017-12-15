import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Alert, Button, Row, Col } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm, Field, Fields } from 'redux-form/immutable'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import TextareaField from 'components/TextareaField'
import TagsInputField from 'components/TagsInputField'
import RichEditorField from 'components/RichEditorField'
import Uploader from 'components/Uploader'
import VisibilityFields from './VisibilityFields'


class PostForm extends PureComponent {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: ImmutablePropTypes.map,
    onBack: PropTypes.func,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
    featuredImage: PropTypes.string,
  }

  renderFeaturedImageField = ({ input }) => {
    return <Uploader bordered onChange={input.onChange} preview />
  }

  handleClickBack = (e) => {
    e.preventDefault()

    const { onBack } = this.props
    if (onBack) {
      onBack()
    }
  }

  render() {
    const {
      error, handleSubmit, initialValues, onBack, submitFailed, submitting,
      featuredImage,
    } = this.props

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || `Failed to ${initialValues.get('title') ? 'update the' : 'create a'} post`}
        </Alert>}

        <div className="bordered-box no-bottom-padding">
          <Row>
            <Col md="8" sm="12">
              <FormField
                name="title"
                type="text"
                label="Add blog title"
                component={InputField}
              />
              <FormField
                name="content"
                label="Add blog content"
                component={RichEditorField}
              />
              <FormField
                name="excerpt"
                label="Excerpt"
                component={TextareaField}
                helpText="* Excerpts are optional hand-crafted summaries"
              />
            </Col>
            <Col md="4" sm="12">
              <Fields
                names={['visibility', 'is_sticky', 'password']}
                component={VisibilityFields}
              />
              <FormField
                name="tagnames"
                label="Tags:"
                component={TagsInputField}
              />
              <div className="mb-2">
                <label>Set featured image</label>
                {featuredImage && <img
                  className="d-block w-100 mb-2"
                  src={featuredImage}
                  alt="Featured"
                />}
                <Field
                  name="image_file"
                  component={this.renderFeaturedImageField}
                />
              </div>
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
    form: 'postForm',
    validate,
  })
)(PostForm)