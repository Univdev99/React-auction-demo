import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppLayout1 from 'pages/AppLayout1'
import AccountForm from 'components/AccountForm'
import Spinner from 'components/Spinner'
import { updateCurrentUser } from 'store/modules/auth'
import { authSelector } from 'store/selectors'


class AccountSettings extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    updateCurrentUser: PropTypes.func.isRequired,
  }

  handleSubmit = (data) => {
    this.props.updateCurrentUser({
      data,
    })
  }

  render() {
    const { auth } = this.props
    const userLoaded = auth.get('userLoaded')

    if (!userLoaded) {
      return <AppLayout1>
        <Spinner />
      </AppLayout1>
    }

    const updatingCurrentUser = auth.get('updatingCurrentUser')
    const updatingCurrentUserFailed = auth.get('updatingCurrentUserFailed')
    const currentUser = auth.get('currentUser')

    return (
      <AppLayout1>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

              <h3 className="mb-4 text-center">Account Settings</h3>

              {updatingCurrentUserFailed && <div className="mb-2 text-danger">
                Failed to update your account settings
              </div>}

              <AccountForm 
                initialValues={currentUser}
                disabled={updatingCurrentUser}
                onSubmit={this.handleSubmit}
              />

            </div>
          </div>
        </div>
      </AppLayout1>
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
)(AccountSettings)
