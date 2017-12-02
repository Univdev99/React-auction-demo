import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Badge, Button, Col, Row } from 'reactstrap'

import auctionBidFlow from 'utils/auctionBidFlow'
import AuctionCard from 'components/AuctionCard'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import SectionTitle from 'components/SectionTitle'
import Slider from 'components/Slider'
import Spinner from 'components/Spinner'
import TimeLeft from 'components/TimeLeft'
import { auctionsSelector } from 'store/selectors'
import { getAuctionDetail } from 'store/modules/auctions'


class AuctionDetail extends PureComponent {

  static propTypes = {
    auctions: ImmutablePropTypes.map.isRequired,
    getAuctionDetail: PropTypes.func.isRequired,
    startBidFlow: PropTypes.func.isRequired
  }

  constructor(props) {
    super()

    this.state = {
      status: 0, // 0: loading, 1: loaded, -1: error
    }
  }

  breadcrumbPath() {
    const auctionDetail = this.props.auctions.get('auctionDetail')

    return [
      { route: '/', text: 'Home' },
      { route: '/auctions', text: 'Auctions' },
      { text: auctionDetail ? auctionDetail.get('title') : '' },
    ]
  }

  getDetail = (id) => {
    const { getAuctionDetail } = this.props

    this.setState({
      status: 0
    })

    getAuctionDetail({
      id,
      success: () => this.setState({
        status: 1
      }),
      fail: () => this.setState({
        status: -1
      }),
    })
  }

  componentWillMount() {
    this.getDetail(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getDetail(nextProps.match.params.id)
    }
  }

  handleBid = () => {
    const { auctions, startBidFlow } = this.props
    const auctionId = auctions.getIn(['auctionDetail', 'pk'])
    startBidFlow(auctionId)
  }

  render() {
    const { auctions } = this.props
    const auctionDetail = auctions.get('auctionDetail')
    const { status } = this.state

    return (
      <FrontContainerLayout breadcrumbPath={this.breadcrumbPath()} subscribe>
        {status !== -1 && !auctionDetail && <Spinner />}

        {status === -1 && <SectionTitle><center>Auction not found</center></SectionTitle>}

        {status !== -1 && auctionDetail && <div>
          <Row className="mb-5">
            <Col xs={12} md={6} className="mb-5">
              <Slider media={auctionDetail.getIn(['product', 'media'])} />
            </Col>
            <Col xs={12} md={6} className="mb-5">
              <div className="px-3">
                <SectionTitle>{auctionDetail.get('title')}</SectionTitle>
                <div className="pb-3 mb-4 mt-4">
                  <div className="h4">
                    <Badge color="light">
                      <img
                        src={auctionDetail.getIn(['product', 'donor_details', 'charity', 'logo'])}
                        alt="Charity Logo" 
                        style={{ maxHeight: 50, maxWidth: '100%' }}
                      />
                      {' '}
                      {auctionDetail.getIn(['product', 'donor_details', 'charity', 'title'])}
                    </Badge>
                  </div>
                  <p>{auctionDetail.getIn(['product', 'donor_details', 'charity', 'description'])}</p>
                  <div className="h5 mb-4 mt-4">
                    Time Left: <TimeLeft until={auctionDetail.get('open_until')} />
                  </div>
                  <Button color="primary" onClick={this.handleBid}>
                    Place a bid
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <SectionTitle className="mb-4">Details</SectionTitle>
          <p>
            {auctionDetail.getIn(['product', 'description'])}
          </p>

          <SectionTitle className="mb-5">More from {auctionDetail.getIn(['product', 'donor_details', 'title'])}</SectionTitle>
          <Row className="mb-5">
            {auctionDetail.get('donor_auctions').map(auction => (
              <AuctionCard key={auction.get('pk')} auction={auction.toJS()} />
            ))}
          </Row>

          <SectionTitle className="mb-5">Similar Auctions</SectionTitle>
          <Row className="mb-5">
            {auctionDetail.get('similar_auctions').map(auction => (
              <AuctionCard key={auction.get('pk')} auction={auction.toJS()} />
            ))}
          </Row>
        </div>}
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
  auctions: auctionsSelector,
})

const actions = {
  getAuctionDetail,
}

export default compose(
  auctionBidFlow,
  connect(selector, actions)
)(AuctionDetail)
