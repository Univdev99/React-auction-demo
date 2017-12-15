import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import DonorCard from 'components/DonorCard'
import EmptyItems from 'components/EmptyItems'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import ListWrapper from 'components/ListWrapper'
import MoreButton from 'components/MoreButton'
import Spinner from 'components/Spinner'
import { API_PENDING, API_SUCCESS, API_FAIL } from 'store/api/request'
import { getDonorListPage } from 'store/modules/donors'
import { donorsSelector } from 'store/selectors'


class Donors extends PureComponent {

  static propTypes = {
    donors: ImmutablePropTypes.map.isRequired,
    getDonorListPage: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { getDonorListPage } = this.props
    getDonorListPage()
  }

  handleLoadMore = () => {
    const { getDonorListPage } = this.props
    getDonorListPage({ loadMore: true })
  }

  render() {
    const { donors } = this.props
    const donorListPage = donors.get('donorListPage')
    const donorListPageStatus = donors.get('donorListPageStatus')
    const hasItems = !!donors.get('donorCount')
    const failed = donorListPageStatus === API_FAIL
    const hasMore = !!donors.get('donorNextPage') && !failed
    const noItems = donorListPageStatus === API_SUCCESS && !hasItems
    const isLoading = donorListPageStatus === API_PENDING

    return (
      <FrontContainerLayout
        title="Do-Gooders"
        subscribe
      >
        {hasItems && (
          <ListWrapper>
            {donorListPage.map(donor => (
              <DonorCard donor={donor} key={donor.get('pk')} />
            ))}
          </ListWrapper>
        )}
        {noItems && (
          <EmptyItems
            description="Sorry, No do-gooders added yet."
            actionText="Subscribe to get updates."
          />
        )}
        {isLoading && <Spinner />}
        {failed &&
          <EmptyItems description="Failed to fetch do-gooders." />
        }
        {hasMore && <MoreButton
          onClick={this.handleLoadMore}
          text="Show More"
          disabled={isLoading}
        />}
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
  donors: donorsSelector,
})

const actions = {
  getDonorListPage,
}

export default compose(
  connect(selector, actions)
)(Donors)
