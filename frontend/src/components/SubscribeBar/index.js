import React, { PureComponent } from 'react'
import { Col, Container, Row } from 'reactstrap'
import { reduxForm } from 'redux-form/immutable'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { show as showModal } from 'redux-modal'

import SubscribeForm from 'components/SubscribeForm'
import { MAILCHIMP_TYPE_NEWSLETTER } from 'config'
import { mailchimpSubscribe } from 'utils/form'


const COMPONENT_CLASS = 'subscribe-bar'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class SubscribeBar extends PureComponent {

  doSubmit = (data) => {
    const { showModal } = this.props
    return mailchimpSubscribe(MAILCHIMP_TYPE_NEWSLETTER, data.get('email'))
      .then(() => {
        showModal('messageModal', {
          title: 'Thank you!',
          subtitle: 'Successfully subscribed to our newsletter'
        })
      })
      .catch((err) => {
        showModal('messageModal', {
          title: 'Error',
          text: err.errors._error
        })
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

const actions = {
  showModal
}

export default compose(
  connect(null, actions),
  reduxForm({
    form: 'subscribeBarForm',
    propNamespace: 'subscribeForm'
  })
)(SubscribeBar)
