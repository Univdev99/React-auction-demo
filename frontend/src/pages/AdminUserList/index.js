import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable' 
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Nav, NavItem, NavLink,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'

import Pagination from 'components/Pagination'
import SectionTitle from 'components/SectionTitle'
import {
  getUserList,
  blockUnblockUser,
} from 'store/modules/admin/users'
import {
  adminUsersSelector,
} from 'store/selectors'
import { ADMIN_TABLE_PAGE_SIZE } from 'config'
import UserTable from './UserTable'


class AdminUserList extends PureComponent {

  static propTypes = {
    adminUsers: ImmutablePropTypes.map.isRequired,
    getUserList: PropTypes.func.isRequired,
    blockUnblockUser: PropTypes.func.isRequired,
  }

  state = {
    columnMenuOpen: false,
    columnList: Immutable.fromJS([
      { field: 'email', label: 'Email', enabled: true },
      { field: 'name', label: 'Name', enabled: true },
      { field: 'auctions_total', label: 'Auctions Total', enabled: true },
      { field: 'date_joined', label: 'Joined', enabled: true },
      { field: 'address', label: 'Address', enabled: true },
      { field: 'group', label: 'Group', enabled: true },
      { field: 'status', label: 'Status', enabled: true },
    ])
  }

  getColumnIndex = (field) => {
    const { columnList } = this.state
    const count = columnList.size

    for (let i = 0; i < count; i++) {
      const _column = columnList.get(i)
      if (_column.get('field') === field) {
        return i
      }
    }
    return -1
  }

  handleToggleColumnMenu = (e) => {
    if (e.target.classList.contains('dropdown-item')) {
      return
    }

    this.setState({
      columnMenuOpen: !this.state.columnMenuOpen
    })
  }

  handleToggleColumn = (field, event) => {
    event.preventDefault()

    const { columnList } = this.state
    const columnIndex = this.getColumnIndex(field)

    if (columnIndex >= 0) {
      const path = [columnIndex, 'enabled']
      this.setState({
        columnList: columnList.setIn(
          path,
          !columnList.getIn(path)
        )
      })
    }
  }

  handleBlockUnblockUser = (id, block) => {
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

    const { columnMenuOpen, columnList } = this.state

    return (
      <div>
        <SectionTitle className="mb-5">Users</SectionTitle>

        <Nav pills>
          <NavItem className="ml-auto">
            <NavLink tag="span" className="column-selection">
              <Dropdown isOpen={columnMenuOpen} toggle={this.handleToggleColumnMenu}>
                <DropdownToggle size="sm" color="link" className="p-0 decoration-none">
                  <i className="fa fa-gear mr-2" /> Column Selection
                </DropdownToggle>
                <DropdownMenu right>
                  {columnList.filter(
                    column => column.get('field') !== 'item_number'
                  ).map(column => (
                    <DropdownItem
                      key={column.get('field')}
                      className="position-relative"
                      onClick={this.handleToggleColumn.bind(this, column.get('field'))}
                    >
                      <div className="menu-tick">
                        {
                          column.get('enabled') ?
                          <i className="fa fa-dot-circle-o" /> :
                          <i className="fa fa-circle-o" />
                        }
                      </div>
                      {column.get('label')}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavLink>
          </NavItem>
        </Nav>

        <UserTable
          columnList={columnList}
          loadingStatus={userListStatus}
          userList={userListPage}
          onBlockUnblock={this.handleBlockUnblockUser}
        />

        <div className="mt-5 text-center">
          <Pagination
            currentPage={userListPageNumber}
            totalCount={userListCount}
            pageSize={ADMIN_TABLE_PAGE_SIZE}
            onPage={this.loadData}
          />
        </div>
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
