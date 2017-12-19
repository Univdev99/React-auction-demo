import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button, Col, Row } from 'reactstrap'
import { FormattedNumber } from 'react-intl'
import { Link } from 'react-router-dom'

import auctionBidFlow from 'utils/auctionBidFlow'
import AuctionCard from 'components/AuctionCard'
import CharitiesBlock from 'components/CharitiesBlock'
import EmptyItems from 'components/EmptyItems'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import HtmlBlock from 'components/HtmlBlock'
import ListWrapper from 'components/ListWrapper'
import Section from 'components/Section'
import SectionTitle from 'components/SectionTitle'
import MediaSlider from 'components/MediaSlider'
import Spinner from 'components/Spinner'
import TimeLeft from 'components/TimeLeft'
import { API_PENDING, API_SUCCESS, API_FAIL } from 'store/api/request'
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

  renderDetail() {
    const { auctions } = this.props
    const auctionDetail = auctions.get('auctionDetail')
    const donorAuctions = auctionDetail.get('donor_auctions')
    const similarAuctions = auctionDetail.get('similar_auctions')
    const donor = auctionDetail.getIn(['product', 'donor_details'])

    return (
      <div>
        <Section>
          <Row>
            <Col xs={12} md={7} className="mb-40 mb-md-0">
              <MediaSlider media={auctionDetail.getIn(['product', 'media'])} />
            </Col>
            <Col xs={12} md={5}>
              <div className="pl-md-3">
                <SectionTitle>{auctionDetail.get('title')}</SectionTitle>
                <div className="pb-3 mt-4">
                  <h4>By: {donor.get('title')}</h4>
                  <CharitiesBlock charities={donor.get('charities')} />
                  <div className="h4 mb-3">
                    Time Left: <TimeLeft until={auctionDetail.get('open_until')} />
                  </div>
                  <div className="h4 mb-4 pb-2 text-primary">
                    Current Bid: <FormattedNumber format="currency" value={auctionDetail.get('current_price')} />
                  </div>
                  <Button block size="lg" color="primary" onClick={this.handleBid}>
                    Bid Now
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Section>
        <Section title="Details">
          <HtmlBlock html={auctionDetail.getIn(['product', 'description'])} />
        </Section>

        <Section
          title={
            <span>
              More from <Link to={`/donors/${donor.get('pk')}`}>{donor.get('title')}</Link>
            </span>
          }
        >
          {donorAuctions && donorAuctions.size ? (
            <ListWrapper>
              {donorAuctions.map(auction => (
                <AuctionCard key={auction.get('pk')} auction={auction} />
              ))}
            </ListWrapper>
          ) : (
            <EmptyItems
              description="Sorry, there’s no more auctions for this Do-Gooder."
              actionText="Get updates on new auctions."
            />
          )}
        </Section>

        <Section title="Similar Auctions">
          {similarAuctions && similarAuctions.size ? (
            <ListWrapper>
              {similarAuctions.map(auction => (
                <AuctionCard key={auction.get('pk')} auction={auction} />
              ))}
            </ListWrapper>
          ) : (
            <EmptyItems
              description="Sorry, there’s no similar auctions to this one."
              actionText="Get updates on new auctions."
            />
          )}
        </Section>
      </div>
    )
  }

  render() {
    const { auctions } = this.props
    const auctionDetailStatus = auctions.get('auctionDetailStatus')

    return (
      <FrontContainerLayout breadcrumbPath={this.breadcrumbPath()} subscribe>
        {auctionDetailStatus === API_PENDING && <Spinner />}

        {auctionDetailStatus === API_FAIL &&
          <SectionTitle><center>Auction not found</center></SectionTitle>
        }
 
        {auctionDetailStatus === API_SUCCESS && this.renderDetail()}
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
