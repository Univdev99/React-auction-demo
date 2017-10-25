import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AdminLayout from 'pages/AdminLayout'
import { authSelector } from 'store/selectors'


class AdminIndex extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
  }

  render() {
    return (
      <AdminLayout>
        Admin index page
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

export default compose(
  connect(selector)
)(AdminIndex)
