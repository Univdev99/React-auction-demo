import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Spinner from 'components/Spinner'
import {
  getUserList,
  blockUnblockUser,
} from 'store/modules/admin/users'
import {
  adminUsersSelector,
} from 'store/selectors'


class AdminUserList extends PureComponent {

  static propTypes = {
    adminUsers: ImmutablePropTypes.map.isRequired,
    getUserList: PropTypes.func.isRequired,
    blockUnblockUser: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1
  }

  handleBlockUnblockUser = (id, block, event) => {
    event.preventDefault()

    const action = block ? 'Block' : 'Unblock'
    if (!window.confirm(`Are you sure to ${action} this user?`)) {
      return
    }

    this.props.blockUnblockUser({
      id,
      data: {
        block: !!block
      },
      fail: () => {
        alert(`Failed to ${action} user`)
      },
    })
  }

  componentWillMount() {
    this.setState({
      loadingStatus: 1
    })

    this.props.getUserList({
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  render() {
    const { adminUsers } = this.props
    const userList = adminUsers.get('userList')
    const { loadingStatus } = this.state

    return (
      <div>
        <h2 className="mb-5">Users</h2>

        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Full name</th>
              <th>Admin</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map(user => (
              <tr key={user.get('pk')}>
                <th scope="row">{user.get('pk')}</th>
                <td>{user.get('email')}</td>
                <td>{user.get('username')}</td>
                <td>{user.get('first_name')} {user.get('last_name')}</td>
                <td>{user.get('is_staff') ? 'Admin' : 'Normal User'}</td>
                <td>{user.get('is_active') ? 'Active' : 'Blocked'}</td>
                <td>
                  {
                    user.get('is_active') ?
                    <a className="text-danger" href="/" onClick={this.handleBlockUnblockUser.bind(this, user.get('pk'), true)}>Block</a>
                    :
                    <a className="text-primary" href="/" onClick={this.handleBlockUnblockUser.bind(this, user.get('pk'), false)}>Unblock</a>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminUsers: adminUsersSelector,
})

const actions = {
  getUserList,
  blockUnblockUser,
}

export default compose(
  connect(selector, actions)
)(AdminUserList)
