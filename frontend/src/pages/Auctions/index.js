import React, { PureComponent } from 'react'
import Immutable from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import AuctionCard from 'components/AuctionCard'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import ListWrapper from 'components/ListWrapper'
import MoreButton from 'components/MoreButton'
import SearchBar from 'components/SearchBar'
import Section from 'components/Section'
import { API_PENDING } from 'store/api/request'
import { auctionsSelector } from 'store/selectors'
import { getAuctionList } from 'store/modules/auctions'
import { jsonToQueryString, queryStringToJson } from 'utils/pureFunctions'


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

  componentDidMount() {
    this.getAuctionListPage(false)
  }

  componentDidUpdate(prevProps) {
    const prevSearch = Immutable.fromJS(queryStringToJson(prevProps.location.search))
    const nextSearch = Immutable.fromJS(queryStringToJson(this.props.location.search))
    if (!prevSearch.equals(nextSearch)) {
      this.getAuctionListPage(false)
    }
  }

  getAuctionListPage = (loadMore) => {
    const { getAuctionList, location } = this.props
    const searchParams = queryStringToJson(location.search)
    getAuctionList({
      loadMore,
      params: searchParams
    })
  }

  handleLoadMoreAuctions = () => {
    this.getAuctionListPage(true)
  }

  handleSearch = (searchText) => {
    const { history, location } = this.props
    const searchParams = queryStringToJson(location.search)

    history.push({
      pathname: '/auctions',
      search: jsonToQueryString({
        ...searchParams,
        search: searchText
      })
    })
  }

  render() {
    const { auctions, location } = this.props
    const auctionList = auctions.get('auctionList')
    const auctionListNextPage = auctions.get('auctionListNextPage')
    const auctionListStatus = auctions.get('auctionListStatus')
    const isLoadingAuctions = auctionListStatus === API_PENDING
    const searchParams = queryStringToJson(location.search)

    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath()}
        subscribe
      >
        <Section>
          <SearchBar initialValue={searchParams.search} onSearch={this.handleSearch} />
        </Section>
        <Section title="Auctions">
          <ListWrapper>
            {auctionList.map(auction => (
              <AuctionCard key={auction.get('pk')} auction={auction.toJS()} />
            ))}
          </ListWrapper>
          {auctionListNextPage && <MoreButton
            onClick={this.handleLoadMoreAuctions}
            text="Show More"
            disabled={isLoadingAuctions}
          />}
        </Section>
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
