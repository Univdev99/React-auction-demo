import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import {
  TabContent, TabPane,
  Nav, NavItem, NavLink,
} from 'reactstrap'

import {
  getAuctionList,
  finishAuction,
  cancelAuction,
} from 'store/modules/admin/auctions'
import { adminAuctionsSelector } from 'store/selectors'
import {
  AUCTION_STATUS_PREVIEW,
  AUCTION_STATUS_OPEN,
  AUCTION_STATUS_FINISHED,
  AUCTION_STATUS_CANCELLED,
} from 'config'
import AuctionTable from './AuctionTable'


class AdminAuctionList extends PureComponent {

  static propTypes = {
    adminAuctions: ImmutablePropTypes.map.isRequired,
    getAuctionList: PropTypes.func.isRequired,
    finishAuction: PropTypes.func.isRequired,
    cancelAuction: PropTypes.func.isRequired,
  }

  static columnList = [
    { field: 'item_number', label: 'Item Number' },
    { field: 'item_donor', label: 'Item Donor' },
    { field: 'max_bid', label: 'Max Bid' },
    { field: 'min_bid', label: 'Min Bid' },
    { field: 'highest_bidder', label: 'Highest Bidder' },
    { field: 'time_started', label: 'Time Started' },
    { field: 'time_remaining', label: 'Time Remaining' },
    { field: 'number_of_bids', label: 'Number of Bids' },
  ]

  state = {
    loadingStatus: 1,
    statusFilter: AUCTION_STATUS_OPEN,
  }

  loadData = () => {
    this.setState({
      loadingStatus: 1
    }, () => {
      const { statusFilter } = this.state
      this.props.getAuctionList({
        status: statusFilter,
        success: () => this.setState({
          loadingStatus: 10
        }),
        fail: () => this.setState({
          loadingStatus: -1
        }),
      })
    })
  }

  handleChangeTab = (statusFilter, e) => {
    e.preventDefault()

    this.setState({
      statusFilter,
    })
    this.loadData()
  }

  handleToggleColumnSelection = (e) => {
    e.preventDefault()
  }

  handleFinish = (id) => {
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

  handleCancel = (id) => {
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
    this.loadData()
  }

  render() {
    const { adminAuctions } = this.props
    const auctionList = adminAuctions.get('auctionList')
    const { loadingStatus, statusFilter } = this.state

    return (
      <div>
        <div className="mb-5 clearfix">
          <h2 className="pull-left">Auctions</h2>
          <Link className="btn btn-primary pull-right" to="/admin/auctions/create">Create</Link>
        </div>

        <div>
          <Nav pills>
            <NavItem>
              <NavLink
                href="/"
                className={classnames({ active: statusFilter === AUCTION_STATUS_OPEN })}
                onClick={this.handleChangeTab.bind(this, AUCTION_STATUS_OPEN)}
              >
                In Progress
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="/"
                className={classnames({ active: statusFilter === AUCTION_STATUS_PREVIEW })}
                onClick={this.handleChangeTab.bind(this, AUCTION_STATUS_PREVIEW)}
              >
                Upcoming
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="/"
                className={classnames({ active: statusFilter === AUCTION_STATUS_FINISHED })}
                onClick={this.handleChangeTab.bind(this, AUCTION_STATUS_FINISHED)}
              >
                Finished
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="/"
                className={classnames({ active: statusFilter === AUCTION_STATUS_CANCELLED })}
                onClick={this.handleChangeTab.bind(this, AUCTION_STATUS_CANCELLED)}
              >
                Cancelled
              </NavLink>
            </NavItem>
            <NavItem className="ml-auto">
              <NavLink
                href="/"
                onClick={this.handleToggleColumnSelection}
              >
                Column Selection
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={statusFilter}>
            <TabPane tabId={AUCTION_STATUS_OPEN}>
              <AuctionTable
                loadingStatus={loadingStatus}
                auctionList={auctionList}
                onFinish={this.handleFinish}
                onCancel={this.handleCancel}
              />
            </TabPane>
            <TabPane tabId={AUCTION_STATUS_PREVIEW}>
              <AuctionTable
                loadingStatus={loadingStatus}
                auctionList={auctionList}
                onFinish={this.handleFinish}
                onCancel={this.handleCancel}
              />
            </TabPane>
            <TabPane tabId={AUCTION_STATUS_FINISHED}>
              <AuctionTable
                loadingStatus={loadingStatus}
                auctionList={auctionList}
                onFinish={this.handleFinish}
                onCancel={this.handleCancel}
              />
            </TabPane>
            <TabPane tabId={AUCTION_STATUS_CANCELLED}>
              <AuctionTable
                loadingStatus={loadingStatus}
                auctionList={auctionList}
                onFinish={this.handleFinish}
                onCancel={this.handleCancel}
              />
            </TabPane>
          </TabContent>
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminAuctions: adminAuctionsSelector,
})

const actions = {
  getAuctionList,
  finishAuction,
  cancelAuction,
}

export default compose(
  connect(selector, actions)
)(AdminAuctionList)
