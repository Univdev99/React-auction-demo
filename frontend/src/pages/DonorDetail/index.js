import React, { PureComponent } from 'react'
import { Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import AuctionCard from 'components/AuctionCard'
import DonorCard from 'components/DonorCard'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import Pagination from 'components/Pagination'
import Slider from 'components/Slider'
import Spinner from 'components/Spinner'
import { ACCOUNT_BID_AUCTIONS_PAGE_SIZE } from 'config'
import { auctionsSelector, donorsSelector } from 'store/selectors'
import { getAuctionList } from 'store/modules/auctions'
import { getDonorDetail } from 'store/modules/donors'


class DonorDetail extends PureComponent {

  static propTypes = {
    donors: ImmutablePropTypes.map.isRequired,
    getDonorDetail: PropTypes.func.isRequired,
  }

  state = {
    status: 0, // 0: loading, 1: loaded, -1: error
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

    this.setState({
      status: 0
    })

    getDonorDetail({
      id,
      success: () => this.setState({
        status: 1
      }),
      fail: () => this.setState({
        status: -1
      }),
    })

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

    const auctionList = auctions.get('auctionList')
    const auctionListPageNumber = auctions.get('auctionListPageNumber')
    const auctionListCount = auctions.get('auctionListCount')

    const { status } = this.state

    return (
      <FrontContainerLayout breadcrumbPath={this.breadcrumbPath()} subscribe>
        {status !== -1 && !donorDetail && <Spinner />}

        {status === -1 && <h3><center>Donor not found</center></h3>}

        {status !== -1 && donorDetail && <div>
          <Row className="mb-5">
            <Col xs={12} md={6} className="mb-5">
              <Slider media={donorDetail.get('media')} />
            </Col>
            <Col xs={12} md={6} className="mb-5">
              <div className="px-3">
                <h4 className="pb-3 mb-4">{donorDetail.get('title')}</h4>
                <div className="pb-3 mb-4">
                  <img src={donorDetail.getIn(['charity', 'logo'])} alt="Charity Logo" style={{ maxHeight: 50 }} />
                </div>
                <p>
                  {donorDetail.get('description')}
                </p>
              </div>
            </Col>
          </Row>

          <div className="clearfix mb-5">
            <h3 className="pull-left">Auctions</h3>
          </div>
          <Row className="mb-5">
            {auctionList.map(auction => (
              <Col xs={12} md={2} lg={3} key={auction.get('pk')} className="mb-3">
                <AuctionCard auction={auction.toJS()} />
              </Col>
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

          <div className="clearfix mb-5">
            <h3 className="pull-left">Similar Donors</h3>
            <Link to="/donors" className="pull-right btn btn-sm btn-outline-secondary">All donors</Link>
          </div>

          <Row className="mb-5">
            {donorDetail.get('similar_donors').map(donor => (
              <Col key={donor.get('pk')} xs={12} lg={6} className="mb-3">
                <DonorCard
                  id={donor.get('pk')}
                  image={donor.getIn(['media', 0, 'url'], '')}
                  title={donor.get('title')}
                />
              </Col>
            ))}
          </Row>

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
