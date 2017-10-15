import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppHeader from 'components/AppHeader'
import AppHeaderGuest from 'components/AppHeaderGuest'
import { signOut } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class AppLayout1 extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
  }

  handleSignOut = () => {
    this.props.signOut()
  }

  render() {
    const { auth, children } = this.props
    const username = auth.get('username')

    const header = auth.get('signedIn') ?
      <AppHeader username={username} onSignOut={this.handleSignOut} /> :
      <AppHeaderGuest />

    return (
      <div className="app-layout1">
        {header}
        <div className="container my-4">
          {children}
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

const actions = {
  signOut,
}

export default compose(
  connect(selector, actions)
)(AppLayout1)
