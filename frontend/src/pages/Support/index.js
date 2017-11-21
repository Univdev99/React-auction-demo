import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import { Button, Col, Row } from 'reactstrap'

import FormField from 'components/FormField'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import IconListItem from 'components/IconListItem'
import InputField from 'components/InputField'
import TextareaField from 'components/TextareaField'

const isRequired = value => (value ? undefined : 'This Field is Required')
const isValidEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined

const breadcrumbPath = [
  { route: '/', text: 'Home' },
  { text: 'Support' },
]

class Support extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func
  }

  submitForm = (data) => {
    console.log(data)
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <FrontContainerLayout
        breadcrumbPath={breadcrumbPath}
        title="Support"
        subscribe
      >
        <Row className="mb-5">
          <Col xs={12} md={6}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut nibh dictum, auctor libero ac,
              varius sem. Aenean in augue sed enim pulvinar ultricies eget at nibh. Sed ac iaculis lorem. Donec
              faucibus sodales risus, ac scelerisque urna tristique at. Etiam non nulla molestie mi pellentesque
              rutrum. Fusce sodales tellus sit amet facilisis dictum. Sed sagittis vel dui condimentum dictum.
              Cras ut purus in ligula fermentum convallis. Praesent non dolor imperdiet, rutrum mi in, rhoncus
              neque. Maecenas sed gravida turpis. Proin commodo sem in arcu viverra lobortis. Morbi pulvinar at
              ante sed vestibulum. Sed molestie mi nec odio pharetra finibus non non est. Vivamus cursus velit
              leo, vel malesuada quam aliquam et.
            </p>
          </Col>
          <Col xs={12} md={6}>
            <IconListItem icon="fa-file">
              Etiam non nulla molestie mi pellentesque rutrum. Fusce sodales tellus sit amet facilisis dictum.
              Sed sagittis vel dui condimentum dictum.
            </IconListItem>
            <IconListItem icon="fa-file">
              Cras ut purus in ligula fermentum convallis. Praesent non dolor imperdiet, rutrum mi in, rhoncus
              neque. Maecenas sed gravida turpis. Proin commodo sem in arcu viverra lobortis.
            </IconListItem>
            <IconListItem icon="fa-file">
              ESed molestie mi nec odio pharetra finibus non non est. Vivamus cursus velit leo, vel malesuada
              quam aliquam et.
            </IconListItem>
          </Col>
        </Row>
        <form onSubmit={handleSubmit(this.submitForm)}>
          <Row>
            <Col xs={12} md={6}>
              <FormField
                name="name"
                type="text"
                label="Name"
                validate={[isRequired]}
                component={InputField}
              />
            </Col>
            <Col xs={12} md={6}>
              <FormField
                name="email"
                type="email"
                label="Email"
                validate={[isRequired, isValidEmail]}
                component={InputField}
              />
            </Col>
          </Row>
          <FormField
            name="message"
            label="Message"
            validate={[isRequired]}
            component={TextareaField}
          />
          <div className="text-right">
            <Button type="submit" color="primary">Submit</Button>
          </div>
        </form>
      </FrontContainerLayout>
    )
  }
}

export default compose(
  reduxForm({
    form: 'contactForm'
  })
)(Support)
