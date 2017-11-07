import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Col, Row } from 'reactstrap'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppContainerLayout from 'components/AppContainerLayout'
import Breadcrumb from 'components/Breadcrumb'
import AuctionCard from 'components/AuctionCard'
import AppLayout1 from 'pages/AppLayout1'
import { getAuctionFrontList } from 'store/modules/auctions'
import { auctionsSelector } from 'store/selectors'


class Auctions extends PureComponent {

  static propTypes = {
    auctions: ImmutablePropTypes.map.isRequired,
    getAuctionFrontList: PropTypes.func.isRequired,
  }

  breadcrumbPath() {
    return [
      { route: '/', text: 'Home' },
      { text: 'Auctions' },
    ]
  }

  componentWillMount() {
    const { auctions, getAuctionFrontList } = this.props
    if (!auctions.get('auctionListLoaded')) {
      getAuctionFrontList()
    }
  }

  render() {
    const { auctions } = this.props
    const auctionList = auctions.get('auctionList')

    return (
      <AppLayout1>
        <AppContainerLayout>
          <Breadcrumb className="mb-5" path={this.breadcrumbPath()} />

          <h3 className="mb-5">Auctions</h3>

          <Row>
            {auctionList.map(auction => (
              <Col xs={12} md={2} lg={3} key={auction.get('pk')} className="mb-3">
                <AuctionCard auction={auction.toJS()} />
              </Col>
            ))}
          </Row>
        </AppContainerLayout>
      </AppLayout1>
    )
  }
}

const selector = createStructuredSelector({
  auctions: auctionsSelector,
})

const actions = {
  getAuctionFrontList,
}

export default compose(
  connect(selector, actions)
)(Auctions)
