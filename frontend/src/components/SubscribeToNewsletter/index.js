import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'


class SubscribeToNewsletter extends PureComponent {

  static propTypes = {
    onSubscribe: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  state = {
    email: ''
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value
    })
  }

  handleSubscribe = (e) => {
    e.preventDefault()

    const { email } = this.state
    if (!email) {
      return
    }
    this.props.onSubscribe(email)
  }

  render() {
    const { disabled } = this.props
    const { email } = this.state

    return (
      <div className="bg-secondary text-light py-4">
        <div className="container text-center">
          Subscribe to our newsletter: <span style={{ display: 'inline-block' }}>
            <form className="form-inline" onSubmit={this.handleSubscribe}>
              <div className="form-group mx-sm-3">
                <input type="email" className="form-control" onChange={this.handleEmailChange} value={email} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={!!disabled}>Subscribe</button>
            </form>
          </span>
        </div>
      </div>
    )
  }
}

export default SubscribeToNewsletter
