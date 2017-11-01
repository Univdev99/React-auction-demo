import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AccountForm from 'components/AccountForm'
import Spinner from 'components/Spinner'
import { authSelector } from 'store/selectors'
import { updateCurrentUser } from 'store/modules/auth'


class AccountInfo extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    updateCurrentUser: PropTypes.func.isRequired,
  }

  state = {
    updateStatus: 0
  }

  handleSubmit = (data) => {
    this.setState({
      updateStatus: 1
    })

    this.props.updateCurrentUser({
      data,
      success: () => this.setState({
        updateStatus: 10
      }),
      fail: () => this.setState({
        updateStatus: -1
      }),
    })
  }

  render() {
    const { auth } = this.props
    const currentUser = auth.get('currentUser')

    if (!currentUser) {
      return <Spinner />
    }

    const { updateStatus } = this.state

    return (
      <div>

        <h3 className="mb-4">Account Information</h3>

        {updateStatus === -1 && <div className="mb-2 text-danger">
          Failed to update your account settings
        </div>}

        {updateStatus === 10 && <div className="mb-2 text-muted">
          Successfully saved
        </div>}

        <AccountForm 
          initialValues={currentUser}
          disabled={updateStatus === 1}
          onSubmit={this.handleSubmit}
        />

      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

const actions = {
  updateCurrentUser,
}

export default compose(
  connect(selector, actions)
)(AccountInfo)
