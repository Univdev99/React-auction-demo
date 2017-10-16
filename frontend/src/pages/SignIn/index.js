/*global FB:true*/

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

import AppLayout1 from 'pages/AppLayout1'
import SignInForm from 'components/SignInForm'
import { FACEBOOK_APP_ID, FACEBOOK_API_VERSION } from 'config'
import { signIn } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class SignIn extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    signIn: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    fbReady: false,
  }

  handleSubmit = (data) => {
    this.props.signIn({ data })
  }

  signUpWithFacebook = (event) => {
    event.preventDefault()

    if (!this.state.fbReady) {
      return
    }

    FB.login((response) => {
      if (response.status === 'connected') {
        this.props.history.push({
          pathname: `/signup-with-facebook/${response.authResponse.accessToken}`
        })
      } else {
        alert('Failed!')
      }
    }, {
      scope: 'public_profile,email'
    })
  }

  componentDidMount() {
    window.fbAsyncInit = () => {
      FB.init({
        appId : FACEBOOK_APP_ID,
        cookie : true,
        xfbml : true,
        version : FACEBOOK_API_VERSION
      });
      
      this.setState({
        fbReady: true
      })
    };

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  render() {
    const { auth } = this.props
    const signInError = auth.get('signInError')
    const { fbReady } = this.state

    return (
      <AppLayout1>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

              <h3 className="mb-4 text-center">Sign In</h3>

              {signInError && <div className="mb-2 text-danger">
                Login failed, please enter correct username and password
              </div>}

              <SignInForm onSubmit={this.handleSubmit} />

              <center className="mt-2">
                <Link to={{ pathname: 'signup' }}>Sign Up With Email</Link>
              </center>

              <center className="mt-2">
                <a className={fbReady ? '' : 'text-muted'} href="/" onClick={this.signUpWithFacebook}>Sign Up With Facebook</a>
              </center>

            </div>
          </div>
        </div>
      </AppLayout1>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

const actions = {
  signIn,
}

export default compose(
  withRouter,
  connect(selector, actions),
)(SignIn)
