import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import Spinner from 'components/Spinner'
import AuctionForm from 'components/AuctionForm'
import { getProductList } from 'store/modules/admin/products'
import {
  getAuctionDetail,
  updateAuctionDetail,
} from 'store/modules/admin/auctions'
import { adminProductsSelector, adminAuctionsSelector } from 'store/selectors'


class AdminAuctionDetail extends PureComponent {

  static propTypes = {
    adminProducts: ImmutablePropTypes.map.isRequired,
    adminAuctions: ImmutablePropTypes.map.isRequired,
    getProductList: PropTypes.func.isRequired,
    getAuctionDetail: PropTypes.func.isRequired,
    updateAuctionDetail: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    loadingStatus: 1,
    updatingStatus: 0,
  }

  handleSubmit = (data) => {
    this.setState({
      updatingStatus: 1
    })

    this.props.updateAuctionDetail({
      id: this.props.match.params.id,
      data,
      success: this.handleBack,
      fail: () => this.setState({
        updatingStatus: -1
      }),
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/auctions'
  })

  componentWillMount() {
    const { adminProducts } = this.props
    const productListLoaded = adminProducts.get('productListLoaded')
    if (!productListLoaded) {
      this.props.getProductList()
    }

    this.setState({
      loadingStatus: 1
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
    const { adminProducts, match } = this.props
    const productListLoaded = adminProducts.get('productListLoaded')
    const productList = adminProducts.get('productList')
    const { adminAuctions } = this.props
    const auctionDetail = adminAuctions.get('auctionDetail')
    const { loadingStatus, updatingStatus } = this.state

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
          <div className="mb-5 clearfix">
            <h2 className="pull-left">Edit Auction</h2>
            <Link className="btn btn-primary pull-right" to={`/admin/auctions/${match.params.id}/bids`}>Bids</Link>
          </div>

          {(loadingStatus === 1 || !auctionDetail || !productListLoaded) && <Spinner />}

          {loadingStatus === 10 && auctionDetail && productListLoaded && <div>
            {updatingStatus === -1 && <div className="mb-2 text-danger">
              Failed to update auction
            </div>}

            <AuctionForm
              initialValues={auctionDetail.delete('pk')}
              productList={productList}
              disabled={updatingStatus === 1}
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
  adminProducts: adminProductsSelector,
  adminAuctions: adminAuctionsSelector,
})

const actions = {
  getProductList,
  getAuctionDetail,
  updateAuctionDetail,
}

export default compose(
  connect(selector, actions)
)(AdminAuctionDetail)
