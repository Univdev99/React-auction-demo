/*global FB:true*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FACEBOOK_APP_ID, FACEBOOK_API_VERSION } from 'config'
import { signUpWithFacebook } from 'store/modules/auth'

export default (WrappedComponent, selectData) => {
  class FBHandleComponent extends Component {
    constructor(props) {
      super(props)

      this.state = {
        fbReady: window.fbReady || false
      }
    }

    componentDidMount() {
      if (!window.fbReady) {
        window.fbAsyncInit = () => {
          FB.init({
            appId : FACEBOOK_APP_ID,
            cookie : true,
            xfbml : true,
            version : FACEBOOK_API_VERSION
          })

          window.fbReady = true
          this.setState({ fbReady: true })
        }

        (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0]
          if (d.getElementById(id)) {return}
          js = d.createElement(s)
          js.id = id
          js.src = "https://connect.facebook.net/en_US/sdk.js"
          fjs.parentNode.insertBefore(js, fjs)
        }(document, 'script', 'facebook-jssdk'))
      }
    }

    handleFBSignUp = ({ success, fail}) => {
      const { signUpWithFacebook } = this.props

      FB.login((response) => {
        if (response.status === 'connected') {
          signUpWithFacebook({
            data: { access_token: response.authResponse.accessToken },
            success,
            fail
          })
        } else {
          fail && fail()
        }
      }, {
        scope: 'public_profile,email'
      })
    }

    render() {
      const { fbReady } = this.state
      console.log('fbhandle:true', fbReady)

      return (
        <WrappedComponent 
          {...this.props}
          fbReady={fbReady}
          signUpWithFacebook={this.handleFBSignUp}
        />
      )
    }
  }

  const actions = {
    signUpWithFacebook
  }

  return connect(null, actions)(FBHandleComponent)
}
