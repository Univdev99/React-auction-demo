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
  AUCTION_STATUS_PREVIEW,
  AUCTION_STATUS_OPEN,
} from 'config'


class AuctionTable extends PureComponent {

  static propTypes = {
    auctionList: ImmutablePropTypes.list.isRequired,
    loadingStatus: PropTypes.number.isRequired,
    onFinish: PropTypes.func,
    onCancel: PropTypes.func,
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
    const { loadingStatus, auctionList } = this.props

    return (
      <div className="pt-5">
        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <Table className="mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Current Price</th>
              <th>Status</th>
              <th>Started At</th>
              <th>Ended At</th>
              <th></th>
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
                  <UncontrolledDropdown>
                    <DropdownToggle size="sm" color="link" className="py-0">
                      <i className="fa fa-chevron-down" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        className="text-secondary"
                        to={`/admin/auctions/${auction.get('pk')}`}
                        tag={Link}
                      >
                        Edit
                      </DropdownItem>
                      {auction.get('status') === AUCTION_STATUS_PREVIEW && <DropdownItem
                        className="text-primary"
                        to={`/admin/auctions/${auction.get('pk')}/start`}
                        tag={Link}
                      >
                        Start
                      </DropdownItem>}
                      {auction.get('status') === AUCTION_STATUS_OPEN && <DropdownItem
                        className="text-primary"
                        to="/"
                        onClick={this.handleFinish.bind(this, auction.get('pk'))}
                      >
                        Finish
                      </DropdownItem>}
                      {auction.get('status') === AUCTION_STATUS_OPEN && <DropdownItem
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
            ))}
          </tbody>
        </Table>}
      </div>
    )
  }

}

export default AuctionTable
