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

  state = {
    minContentHeight: 0,
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

  componentDidMount() {
    console.log(this.layoutElement.clientHeight, this.contentElement.clientHeight)
    let headerFooterHeight = this.layoutElement.clientHeight - this.contentElement.clientHeight
    let minContentHeight = window.innerHeight - headerFooterHeight
    this.setState({
      minContentHeight: minContentHeight > 0 ? minContentHeight : 0
    })
  }

  render() {
    const { auth, children } = this.props
    const username = auth.getIn(['currentUser', 'username'], '')
    const isStaff = auth.getIn(['currentUser', 'is_staff'], false)

    const { minContentHeight } = this.state

    const header = auth.get('signedIn') ?
      <AppHeader username={username} onSignOut={this.handleSignOut} isStaff={isStaff} /> :
      <AppHeaderGuest />

    return (
      <div className="app-layout1" ref={element => this.layoutElement = element}>
        {header}

        <div
          className="content"
          ref={element => this.contentElement = element} style={{ minHeight: minContentHeight }}
          style={{ display: 'flex', minHeight: minContentHeight }}
        >
          <div style={{ flex: '1 1 auto' }}>
            {children}
          </div>
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
