import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Alert } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import BidAuctionCard from 'components/BidAuctionCard'
import Pagination from 'components/Pagination'
import Section from 'components/Section'
import Spinner from 'components/Spinner'
import { ACCOUNT_BID_AUCTIONS_PAGE_SIZE, BID_STATUS_ACTIVE } from 'config'
import { accountSelector } from 'store/selectors'
import { API_PENDING, API_SUCCESS, API_FAIL } from 'store/api/request'
import { getMyBids } from 'store/modules/account'


class AccountBids extends PureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    getMyBids: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.getPage(1)
  }

  getPage = (page) => {
    const { getMyBids } = this.props
    this.setState({
      loadingStatus: 1
    })

    getMyBids({
      params: {
        page,
        status: BID_STATUS_ACTIVE
      }
    })
  }

  render() {
    const { account } = this.props
    const bidAuctionsList = account.get('bidAuctionsList')
    const currentPage = account.get('bidAuctionsPageNumber')
    const totalCount = account.get('bidAuctionsCount')
    const bidAuctionsStatus = account.get('bidAuctionsStatus')

    return (
      <Section title="My Current Bids">
        {bidAuctionsStatus === API_PENDING && <Spinner />}

        {bidAuctionsStatus === API_FAIL && <Alert color="danger">
          Failed to load data.
        </Alert>}

        {bidAuctionsStatus === API_SUCCESS && bidAuctionsList.map((auction, index) => (
          <BidAuctionCard key={index} auction={auction.toJS()} />
        ))}

        <div className="mt-5 text-center">
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={ACCOUNT_BID_AUCTIONS_PAGE_SIZE}
            onPage={this.getPage}
          />
        </div>
      </Section>
    )
  }
}

const selector = createStructuredSelector({
  account: accountSelector
})

const actions = {
  getMyBids
}

export default compose(
  connect(selector, actions)
)(AccountBids)
