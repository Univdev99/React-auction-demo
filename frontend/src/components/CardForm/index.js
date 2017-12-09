import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { Button, Col, FormGroup, Label, Row } from 'reactstrap'
import { CardCVCElement, CardExpiryElement, CardNumberElement, injectStripe } from 'react-stripe-elements'


const COMPONENT_CLASS = 'card-form'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`


class CardForm extends PureComponent {

  static propTypes = {
    disabled: PropTypes.bool,
    email: PropTypes.string.isRequired,
    forModal: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    stripe: PropTypes.object.isRequired,
  }

  state = {
    tokenCreating: false
  }

  createOptions = () => {
    return {
      style: {
        base: {
          color: '#424770',
          letterSpacing: '0.025em',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    }
  }

  handleSubmit = (event) => {
    event.preventDefault() 

    this.setState({
      tokenCreating: true
    })

    const { email, stripe, onSubmit } = this.props
    stripe.createToken({ email })
      .then(payload => {
        this.setState({
          tokenCreating: false
        })
        onSubmit(payload)
      })
      .catch(() => {
        this.setState({
          tokenCreating: false
        })
      })
  }

  render() {
    const { disabled, forModal, onCancel } = this.props
    const { tokenCreating } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label>Card Number</Label>
          <CardNumberElement className={bem('input')} {...this.createOptions()} />
        </FormGroup>
        <Row>
          <Col xs={8}>
            <FormGroup>
              <Label>Expiration</Label>
              <CardExpiryElement className={bem('input')} {...this.createOptions()} />
            </FormGroup>
          </Col>
          <Col xs={4}>
            <FormGroup>
              <Label>CVC</Label>
              <CardCVCElement className={bem('input')} {...this.createOptions()} />
            </FormGroup>
          </Col>
        </Row>
        <Row className="submit-wrapper">
          <Col xs={12} md={6} />
          <Col xs={12} md={forModal ? 12 : 3}>
            <Button type="submit" color="primary" size="lg" block disabled={disabled || tokenCreating}>
              {forModal ? 'Add this card' : 'Save'}
            </Button>
          </Col>
          {!forModal &&
            <Col xs={12} md={3} className="mt-3 mt-md-0">
              <Button color="secondary" type="button" size="lg" block onClick={onCancel} className="mr-2">
                Cancel
              </Button>
            </Col>
          }
        </Row>
      </form>
    )
  }
}

export default compose(
  injectStripe
)(CardForm)
