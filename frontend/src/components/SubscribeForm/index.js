import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Button, Col, Input, Row } from 'reactstrap'
import FormField from 'components/FormField'


const renderField = ({
  input,
  meta: { error, submitFailed, touched },
  placeholder
}) => (
  <Input className="mr-3" style={{ flexGrow: 1}}
    type="email"
    size="lg"
    {...input}
    placeholder={placeholder}
    valid={submitFailed && touched && error ? false : undefined}
  />
)

const isRequired = value => (value ? undefined : 'This Field is Required')
const isValidEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined


class SubscribeForm extends PureComponent {
  static propTypes = {
    forModal: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool
  }

  render() {
    const { forModal, handleSubmit, submitting } = this.props

    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col
            xs={12}
            md={forModal ? undefined : 8}
            className={cx({ 'mb-2 mb-md-0': !forModal, 'mb-4 pb-1': forModal })}>
            <FormField
              name="email"
              placeholder="Email"
              validate={[isRequired, isValidEmail]}
              component={renderField}
            />
          </Col>
          <Col xs={12} md={forModal ? undefined : 4}>
            <Button type="submit" block size="lg" color="primary" disabled={submitting}>
              Subscribe
            </Button>
          </Col>
        </Row>
      </form>
    )
  }
}

export default SubscribeForm
