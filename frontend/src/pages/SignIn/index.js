import React, { PureComponent } from 'react'

import SignInForm from 'components/SignInForm'

class SignIn extends PureComponent {
  handleSubmit = (data) => {
    // process data here
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <SignInForm onSubmit={this.handleSubmit} />
          </div>
        </div>
      </div>
    )
  }
}

export default SignIn
