import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import DonorCard from 'components/DonorCard'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import ListWrapper from 'components/ListWrapper'
import MoreButton from 'components/MoreButton'
import { API_PENDING } from 'store/api/request'
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
    const donorNextPage = donors.get('donorNextPage')
    const isLoading = donorListPageStatus === API_PENDING

    return (
      <FrontContainerLayout
        title="Donors"
        subscribe
      >  
        <ListWrapper>
          {donorListPage.map(donor => (
            <DonorCard
              key={donor.get('pk')}
              id={donor.get('pk')}
              image={donor.getIn(['media', 0, 'url'], '')}
              title={donor.get('title')}
              description={donor.get('description')}
            />
          ))}
        </ListWrapper>
        {donorNextPage && <MoreButton
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
