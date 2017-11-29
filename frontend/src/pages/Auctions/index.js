import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Row } from 'reactstrap'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AuctionCard from 'components/AuctionCard'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import Pagination from 'components/Pagination'
import { ACCOUNT_BID_AUCTIONS_PAGE_SIZE } from 'config'
import { auctionsSelector } from 'store/selectors'
import { getAuctionList } from 'store/modules/auctions'


class Auctions extends PureComponent {

  static propTypes = {
    auctions: ImmutablePropTypes.map.isRequired,
    getAuctionList: PropTypes.func.isRequired,
  }

  breadcrumbPath() {
    return [
      { route: '/', text: 'Home' },
      { text: 'Auctions' },
    ]
  }

  componentDidMount() {
    this.getAuctionListPage(1)
  }

  getAuctionListPage = (page) => {
    const { getAuctionList } = this.props
    getAuctionList({
      params: { page }
    })
  }

  render() {
    const { auctions } = this.props
    const auctionList = auctions.get('auctionList')
    const auctionListPageNumber = auctions.get('auctionListPageNumber')
    const auctionListCount = auctions.get('auctionListCount')

    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath()}
        title="Auctions"
        subscribe
      >
        <Row>
          {auctionList.map(auction => (
            <AuctionCard key={auction.get('pk')} auction={auction.toJS()} />
          ))}
        </Row>
        <div className="my-5 text-center">
          <Pagination
            currentPage={auctionListPageNumber}
            totalCount={auctionListCount}
            pageSize={ACCOUNT_BID_AUCTIONS_PAGE_SIZE}
            onPage={this.getAuctionListPage}
          />
        </div>
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
  auctions: auctionsSelector,
})

const actions = {
  getAuctionList,
}

export default compose(
  connect(selector, actions)
)(Auctions)
