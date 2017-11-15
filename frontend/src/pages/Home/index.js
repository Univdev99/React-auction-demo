import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Button, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'
import { show } from 'redux-modal'

import AppContainerLayout from 'components/AppContainerLayout'
import AppLayout1 from 'pages/AppLayout1'
import AuctionCard from 'components/AuctionCard'
import DonateBar from 'components/DonateBar'
import DonorCard from 'components/DonorCard'
import HomeBanner from 'components/HomeBanner'
import { auctionsSelector, donorsSelector } from 'store/selectors'
import { getDonorFrontList } from 'store/modules/donors'
import { getTrendingAuctionList } from 'store/modules/auctions'

const SUBSCRIBE_MODAL_POPUP_DELAY = 3000

class Home extends PureComponent {

  static propTypes = {
    auctions:  ImmutablePropTypes.map.isRequired,
    donors: ImmutablePropTypes.map.isRequired,
    getTrendingAuctionList: PropTypes.func.isRequired,
    getDonorFrontList: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { show } = this.props
    this.smTimerId = setTimeout(() => {
      this.smTimerId = null
      show('subscribeModal')
    }, SUBSCRIBE_MODAL_POPUP_DELAY)
  }

  componentWillMount() {
    const { auctions, donors, getDonorFrontList, getTrendingAuctionList } = this.props
    if (!auctions.get('auctionTrendingListLoaded')) {
      getTrendingAuctionList()
    }
    if (!donors.get('donorListLoaded')) {
      getDonorFrontList()
    }
  }

  componentWillUnmount() {
    this.smTimerId && clearTimeout(this.smTimerId)
  }

  render() {
    const { auctions, donors } = this.props
    const trendingAuctionsList = auctions.get('auctionTrendingList')
    const donorFrontList = donors.get('donorFrontList')

    return (
      <AppLayout1>
        <HomeBanner />

        <AppContainerLayout>
          <div className="clearfix mb-5">
            <h3 className="pull-left">Donors</h3>
            <Button color="primary" outline tag={Link} to="/donors" className="pull-right">
              All donors
            </Button>
          </div>

          <div className="row">
            {donorFrontList.map(donor => (
              <div key={donor.get('pk')} className="col-lg-6 col-md-12 mb-3">
                <DonorCard
                  id={donor.get('pk')}
                  image={donor.getIn(['media', 0, 'url'], '')}
                  title={donor.get('title')}
                />
              </div>
            ))}
          </div>
        </AppContainerLayout>
        <DonateBar />
        <AppContainerLayout>
          <div className="clearfix mb-5">
            <h3 className="pull-left">Trending Auctions</h3>
            <Button color="primary" outline tag={Link} to="/auctions" className="pull-right">
              All auctions
            </Button>
          </div>

          <Row>
            {trendingAuctionsList.map(auction => (
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
  donors: donorsSelector
})

const actions = {
  getTrendingAuctionList,
  getDonorFrontList,
  show
}

export default compose(
  connect(selector, actions)
)(Home)
