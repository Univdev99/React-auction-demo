import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Button, Col, Row } from 'reactstrap'
import { reduxForm } from 'redux-form/immutable'

import FormField from 'components/FormField'
import TextareaField from 'components/TextareaField'

const isRequired = value => (value ? undefined : 'This Field is Required')

class CommentForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    user: ImmutablePropTypes.map
  }

  render() {
    const { handleSubmit, submitting, user } = this.props

    return (
      <form onSubmit={handleSubmit}>
        <FormField
          name="content"
          placeholder="Comment"
          type="textarea"
          validate={[isRequired]}
          component={TextareaField}
        />
        <Row>
          <Col sm={6}>
            {user && `Signed in as ${user.get('first_name')} ${user.get('last_name')}`}
          </Col>
          <Col sm={6} className="text-right">
            <Button type="submit" color="primary" disabled={submitting}>Submit</Button>
          </Col>
        </Row>
      </form>
    )
  }
}

export default reduxForm({
  form: 'commentForm'
})(CommentForm)
