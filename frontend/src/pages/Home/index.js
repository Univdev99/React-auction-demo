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
import EmptyItems from 'components/EmptyItems'
import HomeBanner from 'components/HomeBanner'
import ListWrapper from 'components/ListWrapper'
import PostItem from 'components/PostItem'
import Section from 'components/Section'
import Spinner from 'components/Spinner'
import { API_PENDING, API_SUCCESS, API_FAIL } from 'store/api/request'
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

  renderTrendingAuctions() {
    const { auctions } = this.props
    const trendingAuctionsList = auctions.get('auctionTrendingList')
    const auctionTrendingListStatus = auctions.get('auctionTrendingListStatus')
    const hasItems = !!trendingAuctionsList.size
    const noItems = auctionTrendingListStatus === API_SUCCESS && !hasItems

    return (
      <Section
        title="Trending Auctions"
        link="/auctions"
        linkText="All Auctions"
      >
        {hasItems && (
          <ListWrapper>
            {trendingAuctionsList.map(auction => (
              <AuctionCard key={auction.get('pk')} auction={auction} />
            ))}
          </ListWrapper>
        )}
        {noItems && (
          <EmptyItems
            description="Sorry, there are no trending auctions yet."
            actionText="Subscribe to get more updates."
          />
        )}
        {auctionTrendingListStatus === API_PENDING && <Spinner />}
        {auctionTrendingListStatus === API_FAIL &&
          <EmptyItems description="Failed to fetch trending auctions." />
        }
      </Section>
    )
  }

  renderDonors() {
    const { donors } = this.props
    const donorFrontList = donors.get('donorFrontList')
    const donorFrontListStatus = donors.get('donorFrontListStatus')
    const hasItems = !!donorFrontList.size
    const noItems = donorFrontListStatus === API_SUCCESS && !hasItems

    return (
      <Section
        title="Do-Gooders"
        link="/donors"
        linkText="All Do-Gooders"
      >
        {hasItems && (
          <ListWrapper>
            {donorFrontList.map(donor => (
              <DonorCard key={donor.get('pk')} donor={donor} />
            ))}
          </ListWrapper>
        )}
        {noItems && (
          <EmptyItems
            description="Sorry, No Do-gooders added yet."
            actionText="Subscribe to get more updates."
          />
        )}
        {donorFrontListStatus === API_PENDING && <Spinner />}
        {donorFrontListStatus === API_FAIL &&
          <EmptyItems description="Failed to fetch do-gooders list." />
        }
      </Section>
    )
  }

  renderBlog() {
    const { blog } = this.props
    const postsList = blog.get('postFrontList')
    const postsListStatus = blog.get('postFrontListStatus')
    const hasItems = !!postsList.size
    const noItems = postsListStatus === API_SUCCESS && !hasItems

    return (
      <Section
        title="Our Blog"
        link="/blog"
        linkText="All Articles"
      >
        {hasItems && (
          <ListWrapper>
            {postsList.map(post => (
              <PostItem key={post.get('pk')} post={post} />
            ))}
          </ListWrapper>
        )}
        {noItems && (
          <EmptyItems
            description="Sorry, No blog articles posted yet."
            actionText="Subscribe to get more updates."
          />
        )}
        {postsListStatus === API_PENDING && <Spinner />}
        {postsListStatus === API_FAIL &&
          <EmptyItems description="Failed to fetch blog posts." />
        }
      </Section>
    )
  }

  render() {
    return (
      <AppLayout1 subscribe>
        <HomeBanner />

        <AppContainerLayout>
          {this.renderTrendingAuctions()}
        </AppContainerLayout>

        <Section>
          <DonateBar />
        </Section>

        <AppContainerLayout>
          {this.renderDonors()}
          {this.renderBlog()}
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
