import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import AuctionCard from 'components/AuctionCard'
import CharitiesBlock from 'components/CharitiesBlock'
import DonorCard from 'components/DonorCard'
import EmptyItems from 'components/EmptyItems'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import HtmlBlock from 'components/HtmlBlock'
import InstagramLink from 'components/InstagramLink'
import ListWrapper from 'components/ListWrapper'
import MoreButton from 'components/MoreButton'
import Section from 'components/Section'
import SectionTitle from 'components/SectionTitle'
import MediaSlider from 'components/MediaSlider'
import Spinner from 'components/Spinner'
import { API_PENDING, API_SUCCESS, API_FAIL } from 'store/api/request'
import { auctionsSelector, donorsSelector } from 'store/selectors'
import { getAuctionList } from 'store/modules/auctions'
import { getDonorDetail } from 'store/modules/donors'


class DonorDetail extends PureComponent {

  static propTypes = {
    donors: ImmutablePropTypes.map.isRequired,
    getDonorDetail: PropTypes.func.isRequired,
  }

  breadcrumbPath() {  
    const donorDetail = this.props.donors.get('donorDetail')

    return [
      { route: '/', text: 'Home' },
      { route: '/donors', text: 'Donors' },
      { text: donorDetail ? donorDetail.get('title') : '' },
    ]
  }

  getDetail = (id) => {
    const { getDonorDetail } = this.props
    getDonorDetail({ id })
    this.getAuctionListPage(false)
  }

  getAuctionListPage = (loadMore) => {
    const { getAuctionList, match: { params } } = this.props
    getAuctionList({
      loadMore,
      params: {
        donor: params.id
      }
    })
  }

  componentDidMount() {
    this.getDetail(this.props.match.params.id)
  }

  componentDidUpdate(prevProps) {
    const { match: { params } } = this.props
    if (params.id !== prevProps.match.params.id) {
      this.getDetail(params.id)
    }
  }

  handleLoadMoreAuctions = () => {
    this.getAuctionListPage(true)
  }

  render() {
    const { auctions, donors } = this.props
    const donorDetail = donors.get('donorDetail')
    const donorDetailStatus = donors.get('donorDetailStatus')

    const auctionList = auctions.get('auctionList')
    const auctionListNextPage = auctions.get('auctionListNextPage')
    const auctionListStatus = auctions.get('auctionListStatus')
    const isLoadingAuctions = auctionListStatus === API_PENDING
    const simiarDonors = donorDetail ? donorDetail.get('similar_donors') : null

    return (
      <FrontContainerLayout breadcrumbPath={this.breadcrumbPath()} subscribe>
        {donorDetailStatus === API_PENDING && <Spinner />}

        {donorDetailStatus === API_FAIL &&
          <SectionTitle className="text-center">Donor not found</SectionTitle>
        }

        {donorDetailStatus === API_SUCCESS && <div>
          <Section>
            <Row>
              <Col xs={12} md={7} className="mb-40 mb-md-0">
                <MediaSlider media={donorDetail.get('media')} />
              </Col>
              <Col xs={12} md={5}>
                <div className="pl-md-3">
                  <SectionTitle>{donorDetail.get('title')}</SectionTitle>
                  <InstagramLink handle={donorDetail.get('instagram_handle')} />
                  <HtmlBlock html={donorDetail.get('description')} />
                  <CharitiesBlock charities={donorDetail.get('charities')} />
                </div>
              </Col>
            </Row>
          </Section>

          <Section title="Auctions">
            {auctionList.size ? (
              <ListWrapper>
                {auctionList.map(auction => (
                  <AuctionCard key={auction.get('pk')} auction={auction} /> 
                ))}
              </ListWrapper>
            ) : (
              <EmptyItems
                description="Sorry, there’s no active auctions for this Do-Gooder."
                actionText="Get updates on new auctions."
              />
            )}
            {auctionListNextPage && <MoreButton
              onClick={this.handleLoadMoreAuctions}
              text="Show More"
              disabled={isLoadingAuctions}
            />}
          </Section>

          <Section
            title="Other Do-Gooders"
            link="/donors"
            linkText="All Do-Gooders"
          >
            {simiarDonors && simiarDonors.size ? (
              <ListWrapper>
                {simiarDonors.map(donor => (
                  <DonorCard donor={donor} />
                ))}
              </ListWrapper>
            ) : (
              <EmptyItems
                description="Sorry, there’s no similar donor for this Do-Gooder."
                actionText="Get updates for this donor."
              />
            )}
          </Section>
        </div>}
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
  auctions: auctionsSelector,
  donors: donorsSelector,
})

const actions = {
  getAuctionList,
  getDonorDetail,
}

export default compose(
  connect(selector, actions)
)(DonorDetail)
