import React, { PureComponent } from 'react'
import Immutable from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import AuctionCard from 'components/AuctionCard'
import AuctionSideFilter from './AuctionSideFilter'
import EmptyItems from 'components/EmptyItems'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import ListWrapper from 'components/ListWrapper'
import MoreButton from 'components/MoreButton'
import SearchBar from 'components/SearchBar'
import Section from 'components/Section'
import { API_PENDING } from 'store/api/request'
import { auctionsSelector } from 'store/selectors'
import { getAuctionList } from 'store/modules/auctions'
import { jsonToQueryString, queryStringToJson } from 'utils/pureFunctions'

const getSearchParams = (query) => {
  const searchParams = queryStringToJson(query)
  return {
    ...searchParams,
    price_range_enabled: !!searchParams.price_range,
    price_range: searchParams.price_range
      ? searchParams.price_range.split(',').map(val => parseInt(val, 10))
      : undefined
  }
}

const getQueryString = (params) => {
  const { price_range_enabled, ...fields } = params
  return jsonToQueryString({
    ...fields,
    price_range: price_range_enabled ? params.price_range : undefined
  })
}

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

  handleSearch = (values) => {
    const { history } = this.props

    history.push({
      pathname: '/auctions',
      search: getQueryString(values.toJS())
    })
  }

  render() {
    const { auctions, location } = this.props
    const auctionList = auctions.get('auctionList')
    const auctionListNextPage = auctions.get('auctionListNextPage')
    const auctionListStatus = auctions.get('auctionListStatus')
    const isLoadingAuctions = auctionListStatus === API_PENDING
    const searchParams = getSearchParams(location.search)

    return (
      <FrontContainerLayout subscribe>
        <AuctionSideFilter initialValues={searchParams} onSubmit={this.handleSearch} />
        <Section>
          <SearchBar initialValues={searchParams} onSubmit={this.handleSearch} />
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
              description={location.search
                ? "Sorry, No auctions found that matches your search criteria."
                : "Sorry, No auctions added yet"
              }
              actionText="Get updates on new auctions."
            />
          )}
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
