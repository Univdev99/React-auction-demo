import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Pagination from 'components/Pagination'
import Spinner from 'components/Spinner'
import {
  registerRealTimeNotificationHandler, unregisterRealTimeNotificationHandler
} from 'managers/RealTimeNotificationManager'
import {
  getAuctionDetail,
  getAuctionBidListPage,
  changeBidStatus,
} from 'store/modules/admin/auctions'
import { adminAuctionsSelector } from 'store/selectors'
import {
  BID_STATUS_ACTIVE, BID_STATUS_REJECTED,
  AUCTION_BID_PAGE_SIZE,
  NOTIFICATION_AUCTION_NEW_BID,
} from 'config'


class AdminAuctionBidList extends PureComponent {

  static propTypes = {
    adminAuctions: ImmutablePropTypes.map.isRequired,
    getAuctionDetail: PropTypes.func.isRequired,
    getAuctionBidListPage: PropTypes.func.isRequired,
    changeBidStatus: PropTypes.func.isRequired,
  }

  state = {
    loadingAuctionStatus: 1,
    loadingStatus: 1,
    page: 1,
  }

  refreshPage = () => {
    this.setState({
      loadingStatus: 1
    })

    const { page } = this.state
    this.props.getAuctionBidListPage({
      id: this.props.match.params.id,
      page,
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  getPage = (page) => {
    this.setState({
      page
    }, this.refreshPage)
  }

  handleClickActivate = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to reactivate this bid?')) {
      return
    }

    this.props.changeBidStatus({
      id: this.props.match.params.id,
      bidId: id,
      data: {
        active: true
      }
    })
  }

  handleClickReject = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to reject this bid?')) {
      return
    }

    this.props.changeBidStatus({
      id: this.props.match.params.id,
      bidId: id,
      data: {
        active: false
      }
    })
  }

  handleNewBidNotification = () => {
    const { adminAuctions } = this.props
    this.getPage(adminAuctions.get('bidListPageNumber'))
  }

  componentWillMount() {
    this.props.getAuctionDetail({
      id: this.props.match.params.id,
      success: () => this.setState({
        loadingAuctionStatus: 10
      }),
      fail: () => this.setState({
        loadingAuctionStatus: -1
      }),
    })

    this.refreshPage()
  }

  componentDidMount() {
    registerRealTimeNotificationHandler(NOTIFICATION_AUCTION_NEW_BID, this.handleNewBidNotification)
  }

  componentWillUnmount() {
    unregisterRealTimeNotificationHandler(NOTIFICATION_AUCTION_NEW_BID, this.handleNewBidNotification)
  }

  render() {
    const { adminAuctions } = this.props
    const auctionDetail = adminAuctions.get('auctionDetail')
    const bidListPage = adminAuctions.get('bidListPage')
    const currentPage = adminAuctions.get('bidListPageNumber')
    const totalCount = adminAuctions.get('bidCount')
    const { loadingStatus, loadingAuctionStatus } = this.state

    return (
      <div>
        {(loadingStatus === 1 || loadingAuctionStatus === 1) && <Spinner />}

        {(loadingStatus === -1 || loadingAuctionStatus === -1) && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && loadingAuctionStatus === 10 && auctionDetail && <div>
          <h2 className="mb-5">Bids on {auctionDetail.get('title')}</h2>

          <table className="table">
            <thead>
              <tr>
                <th>Price</th>
                <th>Status</th>
                <th>Placed At</th>
                <th>Closed At</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bidListPage.map(bid => (
                <tr key={bid.get('pk')}>
                  <th scope="row">{bid.get('price')}</th>
                  <td>{bid.get('status')}</td>
                  <td>{bid.get('placed_at')}</td>
                  <td>{bid.get('closed_at')}</td>
                  <td>{bid.getIn(['user_detail', 'first_name'])} {bid.getIn(['user_detail', 'last_name'])} ({bid.getIn(['user_detail', 'email'])})</td>
                  <td>
                    {bid.get('status') === BID_STATUS_REJECTED && <a
                      href="/"
                      className="text-primary"
                      onClick={this.handleClickActivate.bind(this, bid.get('pk'))}
                    >Activate</a>}
                    {bid.get('status') === BID_STATUS_ACTIVE && <a
                      href="/"
                      className="text-danger"
                      onClick={this.handleClickReject.bind(this, bid.get('pk'))}
                    >Reject</a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5">
            <Pagination
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={AUCTION_BID_PAGE_SIZE}
              onPage={this.getPage}
            />
          </div>
        </div>}
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminAuctions: adminAuctionsSelector,
})

const actions = {
  getAuctionDetail,
  getAuctionBidListPage,
  changeBidStatus,
}

export default compose(
  connect(selector, actions)
)(AdminAuctionBidList)
