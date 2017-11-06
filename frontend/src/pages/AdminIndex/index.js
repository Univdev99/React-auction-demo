import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { authSelector } from 'store/selectors'


class AdminIndex extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
  }

  render() {
    return (
      <div>
        Admin index page
      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

export default compose(
  connect(selector)
)(AdminIndex)
