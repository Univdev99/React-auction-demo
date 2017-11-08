import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Spinner from 'components/Spinner'
import AuctionStartForm from 'components/AuctionStartForm'
import {
  getAuctionDetail,
  startAuction,
} from 'store/modules/admin/auctions'
import { adminAuctionsSelector } from 'store/selectors'


class AdminAuctionDetail extends PureComponent {

  static propTypes = {
    adminAuctions: ImmutablePropTypes.map.isRequired,
    getAuctionDetail: PropTypes.func.isRequired,
    startAuction: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    loadingStatus: 1,
    startingStatus: 0,
    initialValues: null,
  }

  handleSubmit = (data) => {
    this.setState({
      startingStatus: 1
    })

    this.props.startAuction({
      id: this.props.match.params.id,
      data,
      success: this.handleBack,
      fail: () => this.setState({
        startingStatus: -1
      }),
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/auctions'
  })

  componentWillMount() {
    const date = new Date()
    date.setDate(date.getDate() + 5)
    this.setState({
      initialValues: Immutable.Map({
        open_until: date.toISOString()
      })
    })

    this.props.getAuctionDetail({
      id: this.props.match.params.id,
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  render() {
    const { adminAuctions } = this.props
    const auctionDetail = adminAuctions.get('auctionDetail')
    const { loadingStatus, startingStatus, initialValues } = this.state

    if (loadingStatus === -1) {
      return (
        <div>
          <h2>Auction not found</h2>
        </div>
      )
    }

    return (
      <div>
        <div>
          {(loadingStatus === 1 || !auctionDetail) && <Spinner />}

          {loadingStatus === 10 && auctionDetail && <div>
            <h3 className="mb-5">Start Auction For: {auctionDetail.getIn(['product_details', 'title'])}</h3>

            <div className="mb-4">Please enter either ending date or duration of the auction.</div>

            {startingStatus === -1 && <div className="mb-2 text-danger">
              Failed to start auction
            </div>}

            <AuctionStartForm
              initialValues={initialValues}
              disabled={startingStatus === 1}
              onSubmit={this.handleSubmit}
              onBack={this.handleBack}
            />
          </div>}
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminAuctions: adminAuctionsSelector,
})

const actions = {
  getAuctionDetail,
  startAuction,
}

export default compose(
  connect(selector, actions)
)(AdminAuctionDetail)
