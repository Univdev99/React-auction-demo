import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppHeader from 'components/AppHeader'
import { authSelector } from 'store/selectors'


class AppLayout1 extends PureComponent {
  render() {
    const { auth, children } = this.props
    const username = auth.get('username')

    return (
      <div class="app-layout1">
        <AppHeader username={username} />
        <div className="container my-4">
          {children}
        </div>
      </div>
    )
  }
}

AppLayout1.propTypes = {
  auth: ImmutablePropTypes.map.isRequired,
}

const selector = createStructuredSelector({
  auth: authSelector,
})

export default compose(
  connect(selector)
)(AppLayout1)
