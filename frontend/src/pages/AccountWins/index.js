import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment'
import { Alert, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import Pagination from 'components/Pagination'
import Spinner from 'components/Spinner'
import {
  ACCOUNT_BID_AUCTIONS_PAGE_SIZE,
  BID_STATUS_WON
} from 'config'
import { accountSelector } from 'store/selectors'
import { getMyBids } from 'store/modules/account'


class AccountWins extends PureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    getMyBids: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)

    this.state = {
      loadingStatus: 1
    }
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
      },
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  render() {
    const { account } = this.props
    const { loadingStatus } = this.state
    const bidAuctionsList = account.get('bidAuctionsList')
    const currentPage = account.get('bidAuctionsPageNumber')
    const totalCount = account.get('bidAuctionsCount')

    return (
      <div>
        <h3 className="mb-4">Wins</h3>

        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <Alert color="danger">
          Failed to load data.
        </Alert>}

        {loadingStatus === 10 && bidAuctionsList.map((item, index) => (
          <Row key={index} className="align-items-center mb-3">
            <Col md={6} xs={12} className="mb-3 text-center">
              <img
                className="mw-100"
                src={item.getIn(['product_details', 'media', 0, 'url'], '')}
                alt={item.get('title')}
              />
            </Col>
            <Col md={6} xs={12} className="mb-3 text-center text-md-left">
              <h5>{item.get('title')}</h5>
              <div className="mb-3">
                Finished: {moment(item.get('ended_at')).format('ll')}
              </div>
            </Col>
          </Row>
        ))}

        <div className="mt-5 text-center">
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={ACCOUNT_BID_AUCTIONS_PAGE_SIZE}
            onPage={this.getPage}
          />
        </div>
      </div>
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
