import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { Button, Col, FormGroup, Label, Row } from 'reactstrap'
import { CardCVCElement, CardExpiryElement, CardNumberElement, injectStripe } from 'react-stripe-elements'


class CardForm extends PureComponent {

  static propTypes = {
    disabled: PropTypes.bool,
    email: PropTypes.string.isRequired,
    forModal: PropTypes.bool,
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
    const { disabled, forModal } = this.props
    const { tokenCreating } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label>Card Number</Label>
          <CardNumberElement className="form-control" {...this.createOptions()} />
        </FormGroup>
        <Row>
          <Col xs={8}>
            <FormGroup>
              <Label>Expiration</Label>
              <CardExpiryElement className="form-control" {...this.createOptions()} />
            </FormGroup>
          </Col>
          <Col xs={4}>
            <FormGroup>
              <Label>CVC</Label>
              <CardCVCElement className="form-control" {...this.createOptions()} />
            </FormGroup>
          </Col>
        </Row>
        <div className="text-right mt-2">
          <Button color="primary" block={forModal} className="px-5" disabled={disabled || tokenCreating}>
            Add this card
          </Button>
        </div>
      </form>
    )
  }
}

export default compose(
  injectStripe
)(CardForm)
