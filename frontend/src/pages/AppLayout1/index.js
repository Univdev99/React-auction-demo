import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import cx from 'classnames'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppHeader from 'components/AppHeader'
import AppHeaderGuest from 'components/AppHeaderGuest'
import AppFooter from 'components/AppFooter'
import SubscribeToNewsletter from 'components/SubscribeToNewsletter'
import { getCurrentUser } from 'store/modules/auth'
import { signOut } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


const COMPONENT_CLASSNAME = 'app-layout1'
const bem = (suffix) => `${COMPONENT_CLASSNAME}__${suffix}`

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
    let headerFooterHeight = this.layoutElement.clientHeight - this.contentElement.clientHeight
    let minContentHeight = window.innerHeight - headerFooterHeight
    this.setState({
      minContentHeight: minContentHeight > 0 ? minContentHeight : 0
    })
  }

  render() {
    const { auth, children } = this.props
    const username = auth.getIn(
      ['currentUser', 'first_name'],
      auth.getIn(['currentUser', 'username'], '')
    )

    const isStaff = auth.getIn(['currentUser', 'is_staff'], false)

    const { minContentHeight } = this.state

    const header = auth.get('signedIn') ?
      <AppHeader username={username} onSignOut={this.handleSignOut} isStaff={isStaff} /> :
      <AppHeaderGuest />

    return (
      <div className={COMPONENT_CLASSNAME} ref={element => this.layoutElement = element}>
        {header}

        <div
          className={cx('content', bem('content'))}
          ref={element => this.contentElement = element}
          style={{ minHeight: minContentHeight }}
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
