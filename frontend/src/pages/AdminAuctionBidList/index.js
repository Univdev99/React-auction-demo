import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Spinner from 'components/Spinner'
import AdminLayout from 'pages/AdminLayout'
import {
  getAuctionDetail,
  getAuctionBidListPage,
} from 'store/modules/admin/auctions'
import { adminAuctionsSelector } from 'store/selectors'
import { BID_STATUS_ACTIVE } from 'config'


class AdminAuctionBidList extends PureComponent {

  static propTypes = {
    adminAuctions: ImmutablePropTypes.map.isRequired,
    getAuctionDetail: PropTypes.func.isRequired,
    getAuctionBidListPage: PropTypes.func.isRequired,
  }

  state = {
    loadingAuctionStatus: 1,
    loadingStatus: 1
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

    this.props.getAuctionBidListPage({
      id: this.props.match.params.id,
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  render() {
    const { adminAuctions } = this.props
    const auctionDetail = adminAuctions.get('auctionDetail')
    const bidListPage = adminAuctions.get('bidListPage')
    const { loadingStatus, loadingAuctionStatus } = this.state

    return (
      <AdminLayout>
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
                  <td>{bid.getIn(['user_detail', 'first_name'])} {bid.getIn(['user_detail', 'last_name'])} ({bid.getIn(['user_detail', 'email'])}</td>
                  <td>
                    {bid.get('status') === BID_STATUS_ACTIVE && <a href="/" className="text-danger">Reject</a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  adminAuctions: adminAuctionsSelector,
})

const actions = {
  getAuctionDetail,
  getAuctionBidListPage,
}

export default compose(
  connect(selector, actions)
)(AdminAuctionBidList)
