import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { Button } from 'reactstrap'
import { CardElement, injectStripe } from 'react-stripe-elements'


class CardForm extends PureComponent {

  static propTypes = {
    email: PropTypes.string.isRequired,
    stripe: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
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
    const { onSubmit, disabled } = this.props
    const { tokenCreating } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <CardElement className="form-control" {...this.createOptions()} />

        <div className="text-center mt-4">
          <Button color="primary" className="px-5" disabled={disabled || tokenCreating}>Pay</Button>
        </div>
      </form>
    )
  }
}

export default compose(
  injectStripe
)(CardForm)
