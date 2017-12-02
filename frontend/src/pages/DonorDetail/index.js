import React, { PureComponent } from 'react'
import { Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AuctionCard from 'components/AuctionCard'
import CharityInfo from 'components/CharityInfo'
import DonorCard from 'components/DonorCard'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import HtmlBlock from 'components/HtmlBlock'
import ListWrapper from 'components/ListWrapper'
import Pagination from 'components/Pagination'
import Section from 'components/Section'
import SectionTitle from 'components/SectionTitle'
import MediaSlider from 'components/MediaSlider'
import Spinner from 'components/Spinner'
import { ACCOUNT_BID_AUCTIONS_PAGE_SIZE } from 'config'
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
    this.getAuctionListPage(1)
  }

  getAuctionListPage = (page) => {
    const { getAuctionList, match: { params } } = this.props
    getAuctionList({
      params: {
        donor: params.id,
        page
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

  render() {
    const { auctions, donors } = this.props
    const donorDetail = donors.get('donorDetail')
    const donorDetailStatus = donors.get('donorDetailStatus')

    const auctionList = auctions.get('auctionList')
    const auctionListPageNumber = auctions.get('auctionListPageNumber')
    const auctionListCount = auctions.get('auctionListCount')

    return (
      <FrontContainerLayout breadcrumbPath={this.breadcrumbPath()} subscribe>
        {donorDetailStatus === API_PENDING && <Spinner />}

        {donorDetailStatus === API_FAIL &&
          <SectionTitle className="text-center">Donor not found</SectionTitle>
        }

        {donorDetailStatus === API_SUCCESS && <div>
          <Section>
            <Row>
              <Col xs={12} md={7} className="mb-5">
                <MediaSlider media={donorDetail.get('media')} />
              </Col>
              <Col xs={12} md={5} className="mb-5">
                <div className="px-1">
                  <SectionTitle>{donorDetail.get('title')}</SectionTitle>
                  <HtmlBlock html={donorDetail.get('description')} />
                  <CharityInfo charity={donorDetail.get('charity').toJS()} />
                </div>
              </Col>
            </Row>
          </Section>

          <Section title="Auctions">
            <ListWrapper>
              {auctionList.map(auction => (
                <AuctionCard key={auction.get('pk')} auction={auction.toJS()} /> 
              ))}
            </ListWrapper>
            <div className="my-5 text-center">
              <Pagination
                currentPage={auctionListPageNumber}
                totalCount={auctionListCount}
                pageSize={ACCOUNT_BID_AUCTIONS_PAGE_SIZE}
                onPage={this.getAuctionListPage}
              />
            </div>
          </Section>

          <Section
            title="Other Do-Gooders"
            link="/donors"
            linkText="All Do-Gooders"
          >
            <ListWrapper>
              {donorDetail.get('similar_donors').map(donor => (
                <DonorCard
                  key={donor.get('pk')} 
                  id={donor.get('pk')}
                  image={donor.getIn(['media', 0, 'url'], '')}
                  title={donor.get('title')}
                  description={donor.get('description')}
                />
              ))}
            </ListWrapper>
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
