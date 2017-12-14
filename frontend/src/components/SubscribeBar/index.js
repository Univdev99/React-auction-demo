import React, { PureComponent } from 'react'
import { Col, Container, Row } from 'reactstrap'
import { reduxForm } from 'redux-form/immutable'

import SubscribeForm from 'components/SubscribeForm'
import { mailchimpSubscribe } from 'utils/form'


const COMPONENT_CLASS = 'subscribe-bar'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class SubscribeBar extends PureComponent {

  doSubmit = (data) => {
    return mailchimpSubscribe(data.get('email'))
      .catch((err) => {
        alert(err._error)
      })
  }

  render() {
    const { subscribeForm, subscribeForm: { handleSubmit } } = this.props
    return (
      <div className={COMPONENT_CLASS}>
        <Container className="text-center">
          <Row className="align-items-center">
            <Col xl={5} lg={6} xs={12} className="mb-3 mb-lg-0">
              <h4 className={bem('text')}>
                Subscribe to our newsletter
              </h4>
            </Col>
            <Col xl={7} lg={6} xs={12}>
              <div className="ml-auto">
                <SubscribeForm
                  {...subscribeForm}
                  handleSubmit={handleSubmit(this.doSubmit)}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default reduxForm({
  form: 'subscribeBarForm',
  propNamespace: 'subscribeForm'
})(SubscribeBar)
