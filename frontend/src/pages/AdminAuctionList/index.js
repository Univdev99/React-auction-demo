import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import Spinner from 'components/Spinner'
import AdminLayout from 'pages/AdminLayout'
import {
  getAuctionList,
  startAuction,
  finishAuction,
  cancelAuction,
} from 'store/modules/admin/auctions'
import { adminAuctionsSelector } from 'store/selectors'
import {
  AUCTION_STATUS_PREVIEW,
  AUCTION_STATUS_OPEN,
} from 'config'


class AdminAuctionList extends PureComponent {

  static propTypes = {
    adminAuctions: ImmutablePropTypes.map.isRequired,
    getAuctionList: PropTypes.func.isRequired,
    startAuction: PropTypes.func.isRequired,
    finishAuction: PropTypes.func.isRequired,
    cancelAuction: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1
  }

  handleStart = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to start this auction?')) {
      return
    }

    this.props.startAuction({
      id,
      fail: () => {
        alert('Failed to start auction')
      },
    })
  }

  handleFinish = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to finish this auction?')) {
      return
    }

    this.props.finishAuction({
      id,
      fail: () => {
        alert('Failed to finish auction')
      },
    })
  }

  handleCancel = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to cancel this auction?')) {
      return
    }

    this.props.cancelAuction({
      id,
      fail: () => {
        alert('Failed to cancel auction')
      },
    })
  }

  componentWillMount() {
    this.setState({
      loadingStatus: 1
    })

    this.props.getAuctionList({
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
    const auctionList = adminAuctions.get('auctionList')
    const { loadingStatus } = this.state

    return (
      <AdminLayout>
        <div className="mb-4 clearfix">
          <h2 className="pull-left">Auctions</h2>
          <Link className="btn btn-primary pull-right" to="/admin/auctions/create">Create</Link>
        </div>

        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Current Price</th>
              <th>Status</th>
              <th>Started At</th>
              <th>Ended At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctionList.map(auction => (
              <tr key={auction.get('pk')}>
                <th scope="row">{auction.get('pk')}</th>
                <td>{auction.get('title')}</td>
                <td>{auction.get('current_price')}</td>
                <td>{auction.get('status')}</td>
                <td>{auction.get('started_at')}</td>
                <td>{auction.get('ended_at')}</td>
                <td>
                  <Link className="text-secondary pr-3" to={`/admin/auctions/${auction.get('pk')}`}>Edit</Link>
                  {auction.get('status') === AUCTION_STATUS_PREVIEW && <a
                    className="text-primary pr-3"
                    href="/"
                    onClick={this.handleStart.bind(this, auction.get('pk'))}
                  >
                    Start
                  </a>}
                  {auction.get('status') === AUCTION_STATUS_OPEN && <a
                    className="text-primary pr-3"
                    href="/"
                    onClick={this.handleFinish.bind(this, auction.get('pk'))}
                  >
                    Finish
                  </a>}
                  {auction.get('status') === AUCTION_STATUS_OPEN && <a
                    className="text-danger pr-3"
                    href="/"
                    onClick={this.handleCancel.bind(this, auction.get('pk'))}
                  >
                    Cancel
                  </a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  adminAuctions: adminAuctionsSelector,
})

const actions = {
  getAuctionList,
  startAuction,
  finishAuction,
  cancelAuction,
}

export default compose(
  connect(selector, actions)
)(AdminAuctionList)
