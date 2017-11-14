import React, { PureComponent } from 'react'
import { Alert } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import formSubmit from 'utils/formSubmit'
import PasswordForm from 'components/PasswordForm'
import Spinner from 'components/Spinner'
import { authSelector } from 'store/selectors'
import { updatePassword } from 'store/modules/auth'


class AccountPassword extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    updatePassword: PropTypes.func.isRequired,
  }

  state = {
    updateStatus: 0
  }

  handleSubmit = (data) => {
    const { updatePassword } = this.props
    this.setState({
      updateStatus: 1
    })

    return formSubmit(updatePassword, {
      data,
      success: () => this.setState({
        updateStatus: 10
      })
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
  updatePassword,
}

export default compose(
  connect(selector, actions)
)(AccountPassword)
