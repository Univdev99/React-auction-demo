import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Table } from 'reactstrap'

import ContentObjectLink from 'components/ContentObjectLink'
import Pagination from 'components/Pagination'
import SectionTitle from 'components/SectionTitle'
import Spinner from 'components/Spinner'
import {
  getUserHistory,
} from 'store/modules/admin/users'
import { adminUsersSelector } from 'store/selectors'
import { valueOrHyphen, formatDateTime } from 'utils/formatter'
import { ADMIN_TABLE_PAGE_SIZE } from 'config'


class AdminUserHistory extends PureComponent {

  static propTypes = {
    adminUsers: ImmutablePropTypes.map.isRequired,
    getUserHistory: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    loadingStatus: 1,
  }

  loadData = (page = 0) => {
    const { adminUsers, match } = this.props
    const userHistoryListPageNumber = adminUsers.get('userHistoryListPageNumber')

    this.setState({
      loadingStatus: 1
    }, () => {
      this.props.getUserHistory({
        id: match.params.id,
        page: page ? page : userHistoryListPageNumber,
        success: () => this.setState({
          loadingStatus: 10
        }),
        fail: () => this.setState({
          loadingStatus: -1
        }),
      })
    })
  }

  componentWillMount() {
    this.loadData(1)
  }

  render() {
    const { adminUsers } = this.props
    const userHistoryListPage = adminUsers.get('userHistoryListPage')
    const userHistoryListPageNumber = adminUsers.get('userHistoryListPageNumber')
    const userHistoryCount = adminUsers.get('userHistoryCount')
    const { loadingStatus } = this.state

    return (
      <div>
        <SectionTitle className="mb-5">User History</SectionTitle>

        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <div className="responsive-table-wrapper">
          <Table striped className="data-table mb-0">
            <thead>
              <tr>
                <th>Action</th>
                <th>Target</th>
                <th>Extra Data</th>
                <th>Date/time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {userHistoryListPage.map(historyRecord => {
                return (
                  <tr key={historyRecord.get('pk')}>
                    <td>
                      {historyRecord.get('action')}
                    </td>
                    <td>
                      <ContentObjectLink contentObject={historyRecord.get('target')} />
                    </td>
                    <td>
                      {valueOrHyphen(JSON.stringify(historyRecord.get('extra')))}
                    </td>
                    <td>
                      {formatDateTime(historyRecord.get('created_at'))}
                    </td>
                    <td />
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>}

        <div className="mt-5 text-center">
          <Pagination
            currentPage={userHistoryListPageNumber}
            totalCount={userHistoryCount}
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
  getUserHistory,
}

export default compose(
  connect(selector, actions)
)(AdminUserHistory)
