import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import Pagination from 'components/Pagination'
import SectionTitle from 'components/SectionTitle'
import Spinner from 'components/Spinner'
import {
  API_PENDING,
  API_SUCCESS,
  API_FAIL,
} from 'store/api/request'
import {
  getUserList,
  blockUnblockUser,
} from 'store/modules/admin/users'
import {
  adminUsersSelector,
} from 'store/selectors'
import { ADMIN_TABLE_PAGE_SIZE } from 'config'


class AdminUserList extends PureComponent {

  static propTypes = {
    adminUsers: ImmutablePropTypes.map.isRequired,
    getUserList: PropTypes.func.isRequired,
    blockUnblockUser: PropTypes.func.isRequired,
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

  loadData = (page = 1) => {
    const { adminUsers } = this.props
    const userListPageNumber = adminUsers.get('userListPageNumber')

    this.props.getUserList({
      page: page ? page : userListPageNumber,
    })
  }

  componentWillMount() {
    this.loadData(1)
  }

  render() {
    const { adminUsers } = this.props
    const userListPage = adminUsers.get('userListPage')
    const userListCount = adminUsers.get('userListCount')
    const userListPageNumber = adminUsers.get('userListPageNumber')
    const userListStatus = adminUsers.get('userListStatus')

    return (
      <div>
        <SectionTitle className="mb-5">Users</SectionTitle>

        {userListStatus === API_PENDING && <Spinner />}

        {userListStatus === API_FAIL && <div>
          Failed to load data.
        </div>}

        {userListStatus === API_SUCCESS && <div>
          <table className="table table-striped">
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
              {userListPage.map(user => (
                <tr key={user.get('pk')}>
                  <th scope="row">{user.get('pk')}</th>
                  <td>{user.get('email')}</td>
                  <td>{user.get('username')}</td>
                  <td>{user.get('first_name')} {user.get('last_name')}</td>
                  <td>{user.get('is_staff') ? 'Admin' : 'Normal User'}</td>
                  <td>{user.get('is_active') ? 'Active' : 'Blocked'}</td>
                  <td>
                    <Link className="text-secondary pr-3" to={`/admin/users/${user.get('pk')}/history`}>History</Link>
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
          </table>

          <div className="mt-5 text-center">
            <Pagination
              currentPage={userListPageNumber}
              totalCount={userListCount}
              pageSize={ADMIN_TABLE_PAGE_SIZE}
              onPage={this.loadData}
            />
          </div>
        </div>}
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
