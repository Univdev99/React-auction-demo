import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import { Link } from 'react-router-dom'

import {
  API_PENDING,
  API_SUCCESS,
  API_FAIL,
} from 'store/api/request'
import Spinner from 'components/Spinner'
import { formatDateTime } from 'utils/formatter'


class UserTable extends PureComponent {

  static propTypes = {
    columnList: ImmutablePropTypes.list.isRequired,
    loadingStatus: PropTypes.string.isRequired,
    userList: ImmutablePropTypes.list.isRequired,
    onBlockUnblock: PropTypes.func,
  }

  cellValue = (user, field) => {
    const value = user.get(field)

    if (field === 'full_name') {
      return `${user.get('first_name')} ${user.get('last_name')}`
    } else if (field === 'group') {
      return user.get('is_staff') ? 'Admin' : 'Normal User'
    } else if (field === 'status') {
      return user.get('is_active') ? 'Active' : 'Blocked'
    } else if (field === 'date_joined') {
      return formatDateTime(value)
    }
    return value
  }

  handleClickHistory = (id, event) => {
    event.preventDefault()
    this.props.onHistory(id)
  }

  handleClickBlockUnblock = (id, block, event) => {
    event.preventDefault()
    this.props.onBlockUnblock(id, block)
  }

  render() {
    const { loadingStatus, columnList, userList } = this.props

    return (
      <div className="mt-2">
        {loadingStatus === API_PENDING && <Spinner />}

        {loadingStatus === API_FAIL && <div>
          Failed to load data.
        </div>}

        {loadingStatus === API_SUCCESS && <Table striped>
          <thead>
            <tr>
              {columnList.filter(
                column => column.get('enabled')
              ).map(column => (
                <th key={column.get('field')}>{column.get('label')}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userList.map(user => (
              <tr key={user.get('pk')}>
                {columnList.filter(
                  column => column.get('enabled')
                ).map(column => (
                  <td key={column.get('field')}>{this.cellValue(user, column.get('field'))}</td>
                ))}
                <td>
                  <UncontrolledDropdown tag="span">
                    <DropdownToggle size="sm" color="link" className="py-0 text-black">
                      <i className="fa fa-ellipsis-h" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        to={`/admin/users/${user.get('pk')}/history`}
                        tag={Link}
                      >
                        History
                      </DropdownItem>
                      {user.get('is_active') && <DropdownItem
                        to="/"
                        onClick={this.handleClickBlockUnblock.bind(this, user.get('pk'), true)}
                      >
                         Block
                      </DropdownItem>}
                      {!user.get('is_active') && <DropdownItem
                        to="/"
                        onClick={this.handleClickBlockUnblock.bind(this, user.get('pk'), false)}
                      >
                         Unblock
                      </DropdownItem>}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>}
      </div>
    )
  }

}

export default UserTable
