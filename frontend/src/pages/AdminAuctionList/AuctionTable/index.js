import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import {
  Table,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'

import Spinner from 'components/Spinner'
import {
  AUCTION_STATUS_TEXTS,
  AUCTION_STATUS_PREVIEW,
  AUCTION_STATUS_OPEN,
  AUCTION_STATUS_WAITING_FOR_PAYMENT,
  AUCTION_STATUS_WAITING_TO_SHIP,
} from 'config'

class AuctionTable extends PureComponent {

  static propTypes = {
    columnList: ImmutablePropTypes.list.isRequired,
    auctionList: ImmutablePropTypes.list.isRequired,
    loadingStatus: PropTypes.number.isRequired,
    onFinish: PropTypes.func,
    onCancel: PropTypes.func,
  }

  getCellValue = (auction, field) => {
    if (field === 'item_number') {
      return auction.get('pk')
    } else if (field === 'item_donor') {
      return auction.getIn(['product_details', 'donor_details', 'title'], '-')
    } else if (field === 'time_remaining') {
      const secondsRemaining = parseInt(auction.get(field), 10)
      const hours = parseInt(secondsRemaining / 3600, 10)
      const minutes = parseInt((secondsRemaining % 3600) / 60, 10)
      const seconds = secondsRemaining % 60
      return `${hours}h ${minutes}min ${seconds}sec`
    } else if (field === 'status') {
      return AUCTION_STATUS_TEXTS[auction.get('status')]
    }
    return auction.get(field)
  }

  handleFinish = (id, event) => {
    event.preventDefault()

    const { onFinish } = this.props
    if (onFinish) {
      onFinish(id)
    }
  }

  handleCancel = (id, event) => {
    event.preventDefault()

    const { onCancel } = this.props
    if (onCancel) {
      onCancel(id)
    }
  }

  render() {
    const { loadingStatus, columnList, auctionList } = this.props

    return (
      <div className="pt-5">
        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <Table responsive className="data-table mb-0">
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
            {auctionList.map(auction => {
              const auctionStatus = auction.get('status')

              return (
                <tr key={auction.get('pk')}>
                  {columnList.filter(
                    column => column.get('enabled')
                  ).map(column => (
                    <td key={column.get('field')}>{this.getCellValue(auction, column.get('field'))}</td>
                  ))}
                  <td>
                    <UncontrolledDropdown>
                      <DropdownToggle size="sm" color="link" className="py-0">
                        <i className="fa fa-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          to={`/admin/auctions/${auction.get('pk')}`}
                          tag={Link}
                        >
                          Edit
                        </DropdownItem>
                        {auctionStatus === AUCTION_STATUS_PREVIEW && <DropdownItem
                          to={`/admin/auctions/${auction.get('pk')}/start`}
                          tag={Link}
                        >
                          <strong>Start</strong>
                        </DropdownItem>}
                        {auctionStatus === AUCTION_STATUS_OPEN && <DropdownItem
                          to="/"
                          onClick={this.handleFinish.bind(this, auction.get('pk'))}
                        >
                          <strong>Finish</strong>
                        </DropdownItem>}
                        {(
                          auctionStatus === AUCTION_STATUS_OPEN ||
                          auctionStatus === AUCTION_STATUS_WAITING_FOR_PAYMENT ||
                          auctionStatus === AUCTION_STATUS_WAITING_TO_SHIP
                        ) && <DropdownItem
                          className="text-danger pr-3"
                          to="/"
                          onClick={this.handleCancel.bind(this, auction.get('pk'))}
                        >
                          Cancel
                        </DropdownItem>}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>}
      </div>
    )
  }

}

export default AuctionTable
