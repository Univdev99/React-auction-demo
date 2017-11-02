import React, { PureComponent } from 'react'
import { Alert } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { stopSubmit } from 'redux-form'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import PasswordForm from 'components/PasswordForm'
import Spinner from 'components/Spinner'
import { authSelector } from 'store/selectors'
import { updatePassword } from 'store/modules/auth' 


class AccountPassword extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    stopSubmit: PropTypes.func.isRequired,
    updatePassword: PropTypes.func.isRequired,
  }

  state = {
    updateStatus: 0
  }

  handleSubmit = (data) => {
    const { stopSubmit } = this.props
    this.setState({
      updateStatus: 1
    })

    this.props.updatePassword({
      data,
      success: () => {
        this.setState({
          updateStatus: 10
        })
      },
      fail: ({ data }) => {
        this.setState({
          updateStatus: -1
        })
        stopSubmit('changePasswordForm', data)
      }
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

        <h3 className="mb-4">Change Password</h3>

        {updateStatus === -1 && <Alert color="danger">
          Failed to update your password
        </Alert>}

        {updateStatus === 10 && <Alert color="success">
          Successfully updated password
        </Alert>}

        <PasswordForm
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
  stopSubmit,
  updatePassword,
}

export default compose(
  connect(selector, actions)
)(AccountPassword)
