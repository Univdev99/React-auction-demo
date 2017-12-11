import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Alert } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import BidCard from 'components/BidCard'
import Pagination from 'components/Pagination'
import Section from 'components/Section'
import Spinner from 'components/Spinner'
import {
  ACCOUNT_BIDS_PAGE_SIZE,
  BID_STATUS_WON
} from 'config'
import { accountSelector } from 'store/selectors'
import { API_PENDING, API_SUCCESS, API_FAIL } from 'store/api/request'
import { getMyBids } from 'store/modules/account'


class AccountWins extends PureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    getMyBids: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.getPage(1)
  }

  getPage = (page) => {
    const { getMyBids } = this.props
    this.setState({
      loadingStatus: 1
    })

    getMyBids({
      params: {
        page,
        status: BID_STATUS_WON
      }
    })
  }

  render() {
    const { account } = this.props
    const bidsList = account.get('bidsList')
    const currentPage = account.get('bidsPageNumber')
    const totalCount = account.get('bidsCount')
    const bidsStatus = account.get('bidsStatus')

    return (
      <Section title="Wins">
        {bidsStatus === API_PENDING && <Spinner />}

        {bidsStatus === API_FAIL && <Alert color="danger">
          Failed to load data.
        </Alert>}

        {bidsStatus === API_SUCCESS && bidsList.map((bid, index) => (
          <BidCard key={index} bid={bid} />
        ))}

        <div className="mt-5 text-center">
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={ACCOUNT_BIDS_PAGE_SIZE}
            onPage={this.getPage}
          />
        </div>
      </Section>
    )
  }
}

const selector = createStructuredSelector({
  account: accountSelector
})

const actions = {
  getMyBids
}

export default compose(
  connect(selector, actions)
)(AccountWins)
