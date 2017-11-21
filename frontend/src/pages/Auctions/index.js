import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Col, Row } from 'reactstrap'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AuctionCard from 'components/AuctionCard'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
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

  componentWillMount() {
    const { auctions, getAuctionList } = this.props
    if (!auctions.get('auctionListLoaded')) {
      getAuctionList()
    }
  }

  render() {
    const { auctions } = this.props
    const auctionList = auctions.get('auctionList')

    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath()}
        title="Auctions"
        subscribe
      >
        <Row>
          {auctionList.map(auction => (
            <Col xs={12} md={2} lg={3} key={auction.get('pk')} className="mb-3">
              <AuctionCard auction={auction.toJS()} />
            </Col>
          ))}
        </Row>
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
