import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import {
  TabContent, TabPane,
  Nav, NavItem, NavLink,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
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

  state = {
    loadingStatus: 1,
    statusFilter: AUCTION_STATUS_OPEN,
    columnMenuOpen: false,
    columnList: Immutable.fromJS([
      { field: 'item_number', label: 'Item number', enabled: true },
      { field: 'item_donor', label: 'Item donor', enabled: true },
      { field: 'max_bid', label: 'Max bid', enabled: true },
      { field: 'min_bid', label: 'Min bid', enabled: true },
      { field: 'highest_bidder', label: 'Highest bidder', enabled: true },
      { field: 'started_at', label: 'Time started', enabled: true },
      { field: 'time_remaining', label: 'Time remaining', enabled: true },
      { field: 'number_of_bids', label: 'Number of bids', enabled: true },
    ])
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

  handleChangeTab = (statusFilter, e) => {
    e.preventDefault()

    this.setState({
      statusFilter,
    })
    this.loadData()
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
    const { loadingStatus, statusFilter, columnMenuOpen, columnList } = this.state

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
              <NavLink tag="span">
                <Dropdown isOpen={columnMenuOpen} toggle={this.handleToggleColumnMenu}>
                  <DropdownToggle size="sm" color="link" className="p-0">
                    <i className="fa fa-chevron-down" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    {columnList.map(column => (
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
