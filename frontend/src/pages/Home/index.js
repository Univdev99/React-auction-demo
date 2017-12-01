import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { show } from 'redux-modal'

import AppContainerLayout from 'layouts/AppContainerLayout'
import AppLayout1 from 'layouts/AppLayout1'
import AuctionCard from 'components/AuctionCard'
import DonateBar from 'components/DonateBar'
import DonorCard from 'components/DonorCard'
import HomeBanner from 'components/HomeBanner'
import ListWrapper from 'components/ListWrapper'
import PostItem from 'components/PostItem'
import Section from 'components/Section'
import { auctionsSelector, blogSelector, donorsSelector } from 'store/selectors'
import { getDonorFrontList } from 'store/modules/donors'
import { getPostFrontList } from 'store/modules/blog'
import { getTrendingAuctionList } from 'store/modules/auctions'


const SUBSCRIBE_MODAL_POPUP_DELAY = 3000

class Home extends PureComponent {

  static propTypes = {
    auctions:  ImmutablePropTypes.map.isRequired,
    donors: ImmutablePropTypes.map.isRequired,
    blog: ImmutablePropTypes.map.isRequired,
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
    const { auctions, donors, blog, getDonorFrontList, getPostFrontList, getTrendingAuctionList } = this.props
    if (!auctions.get('auctionTrendingListLoaded')) {
      getTrendingAuctionList()
    }
    if (!donors.get('donorListLoaded')) {
      getDonorFrontList()
    }
    if (!blog.get('postFrontListLoaded')) {
      getPostFrontList()
    }
  }

  componentWillUnmount() {
    this.smTimerId && clearTimeout(this.smTimerId)
  }

  render() {
    const { auctions, donors, blog } = this.props
    const trendingAuctionsList = auctions.get('auctionTrendingList')
    const donorFrontList = donors.get('donorFrontList')
    const postsList = blog.get('postFrontList')

    return (
      <AppLayout1 subscribe>
        <HomeBanner />

        <AppContainerLayout>
          <Section
            title="Donors"
            link="/donors"
            linkText="All Donors"
          >
            <ListWrapper>
              {donorFrontList.map(donor => (
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
        </AppContainerLayout>
        <Section>
          <DonateBar />
        </Section>
        <AppContainerLayout>
          <Section
            title="Trending Auctions"
            link="/auctions"
            linkText="All Auctions"
          >
            <ListWrapper>
              {trendingAuctionsList.map(auction => (
                <AuctionCard key={auction.get('pk')} auction={auction.toJS()} />
              ))}
            </ListWrapper>
          </Section>

          <Section
            title="Our Blog"
            link="/blog"
            linkText="All Articles"
          >
            <ListWrapper>
              {postsList.map(post => (
                <PostItem key={post.get('pk')} post={post.toJS()} />
              ))}
            </ListWrapper>
          </Section>
        </AppContainerLayout>
      </AppLayout1>
    )
  }
}

const selector = createStructuredSelector({
  auctions: auctionsSelector,
  donors: donorsSelector,
  blog: blogSelector,
})

const actions = {
  getTrendingAuctionList,
  getDonorFrontList,
  getPostFrontList,
  show
}

export default compose(
  connect(selector, actions)
)(Home)
