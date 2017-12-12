import React from 'react'
import { Button, Col, Row } from 'reactstrap'
import { Field, reduxForm } from 'redux-form/immutable'

import InputField from 'components/InputField'
import FileField from 'components/FileField'
import TextareaField from 'components/TextareaField'


const isRequired = value => (value ? undefined : 'This Field is Required')
const isValidEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined

const ContactForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit(handleSubmit)} className="job-application-form">
    <Row>
      <Col xs={12} md={6}>
        <Field
          name="name"
          type="text"
          label="Name"
          size="lg"
          validate={[isRequired]}
          component={InputField}
        />
      </Col>
      <Col xs={12} md={6}>
        <Field
          name="email"
          type="email"
          label="Email"
          size="lg"
          validate={[isRequired, isValidEmail]}
          component={InputField}
        />
      </Col>
    </Row>
    <Field
      name="message"
      label="Message"
      size="lg"
      validate={[isRequired]}
      component={TextareaField}
    />
    <Row>
      <Col xs={12} md={9} lg={10}>
        <Field
          name="resume"
          placeholder="Attach your CV"
          component={FileField}
        />
      </Col>
      <Col xs={12} md={3} lg={2}>
        <Button block type="submit" color="primary">Send</Button>
      </Col>
    </Row>
  </form>
)

export default reduxForm({
  form: 'contactForm'
})(ContactForm)
