import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Table } from 'reactstrap'
import { Link } from 'react-router-dom'

import Pagination from 'components/Pagination'
import SectionTitle from 'components/SectionTitle'
import Spinner from 'components/Spinner'
import {
  getAuctionBacklog,
} from 'store/modules/admin/auctions'
import { adminAuctionsSelector } from 'store/selectors'
import { valueOrHyphen, formatDateTime } from 'utils/formatter'
import { ADMIN_TABLE_PAGE_SIZE } from 'config'


class AdminBacklog extends PureComponent {

  static propTypes = {
    adminAuctions: ImmutablePropTypes.map.isRequired,
    getAuctionBacklog: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1,
  }

  loadData = (page = 0) => {
    const { adminAuctions } = this.props
    const backlogPageNumber = adminAuctions.get('backlogPageNumber')

    this.setState({
      loadingStatus: 1
    }, () => {
      this.props.getAuctionBacklog({
        page: page ? page : backlogPageNumber,
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
    const { adminAuctions } = this.props
    const backlogPage = adminAuctions.get('backlogPage')
    const backlogPageNumber = adminAuctions.get('backlogPageNumber')
    const backlogItemCount = adminAuctions.get('backlogItemCount')
    const { loadingStatus } = this.state

    return (
      <div>
        <SectionTitle className="mb-5">Backlog</SectionTitle>

        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <div className="responsive-table-wrapper">
          <Table striped className="data-table mb-0">
            <thead>
              <tr>
                <th>Auction</th>
                <th>Winner</th>
                <th>Final bid</th>
                <th>Charity</th>
                <th>Sent out at</th>
                <th>Tracking number</th>
                <th>Cheque sent to charity at</th>
                <th>Receipt received at</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {backlogPage.map(auction => {
                return (
                  <tr key={auction.get('pk')}>
                    <td>
                      <Link to={`/admin/auctions/${auction.get('pk')}`}>
                        {auction.get('title')}
                      </Link>
                    </td>
                    <td>
                      {
                        auction.getIn(['highest_bid', 'user_detail']) ?
                        auction.getIn(['highest_bid', 'user_detail', 'first_name']) + ' ' +
                        auction.getIn(['highest_bid', 'user_detail', 'last_name'])
                        :
                        '-'
                      }
                    </td>
                    <td>{valueOrHyphen(auction.getIn(['highest_bid', 'price']))}</td>
                    <td>
                      <Link to={`/admin/charities/${auction.getIn(['product', 'donor_details', 'charity', 'pk'])}`}>
                        {auction.getIn(['product', 'donor_details', 'charity', 'title'])}
                      </Link>
                    </td>
                    <td>{formatDateTime(auction.getIn(['sale', 'item_sent']))}</td>
                    <td>{valueOrHyphen(auction.getIn(['sale', 'tracking_number']))}</td>
                    <td>{formatDateTime(auction.getIn(['sale', 'cheque_sent_at']))}</td>
                    <td>{formatDateTime(auction.getIn(['sale', 'receipt_received_at']))}</td>
                    <td>{auction.getIn(['sale', 'note'])}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>}

        <div className="mt-5 text-center">
          <Pagination
            currentPage={backlogPageNumber}
            totalCount={backlogItemCount}
            pageSize={ADMIN_TABLE_PAGE_SIZE}
            onPage={this.loadData}
          />
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminAuctions: adminAuctionsSelector,
})

const actions = {
  getAuctionBacklog,
}

export default compose(
  connect(selector, actions)
)(AdminBacklog)
