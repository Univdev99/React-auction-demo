import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppHeader from 'components/AppHeader'
import AppHeaderGuest from 'components/AppHeaderGuest'
import AppFooter from 'components/AppFooter'
import SubscribeToNewsletter from 'components/SubscribeToNewsletter'
import { getCurrentUser } from 'store/modules/auth'
import { signOut } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class AppLayout1 extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
  }

  handleSignOut = () => {
    this.props.signOut()
  }

  handleSubscribe = (email) => {
    console.log(email)///
  }

  componentWillMount() {
    this.props.getCurrentUser()
  }

  render() {
    const { auth, children } = this.props
    const username = auth.getIn(['currentUser', 'username'], '')
    const isStaff = auth.getIn(['currentUser', 'is_staff'], false)

    const header = auth.get('signedIn') ?
      <AppHeader username={username} onSignOut={this.handleSignOut} isStaff={isStaff} /> :
      <AppHeaderGuest />

    return (
      <div className="app-layout1">
        {header}

        <div className="content">
          {children}
        </div>
        <SubscribeToNewsletter onSubscribe={this.handleSubscribe} disabled={true} />
        <AppFooter />
      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

const actions = {
  getCurrentUser,
  signOut,
}

export default compose(
  connect(selector, actions)
)(AppLayout1)
