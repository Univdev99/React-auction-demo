import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'

import AuctionForm from 'components/AuctionForm'
import Spinner from 'components/Spinner'
import AdminLayout from 'pages/AdminLayout'
import { getProductList } from 'store/modules/admin/products'
import { createAuction } from 'store/modules/admin/auctions'
import { adminProductsSelector } from 'store/selectors'


class AdminAuctionCreate extends PureComponent {

  static propTypes = {
    adminProducts: ImmutablePropTypes.map.isRequired,
    getProductList: PropTypes.func.isRequired,
    createAuction: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    creatingStatus: 0,
  }

  handleSubmit = (data) => {
    this.setState({
      creatingStatus: 1
    })
    this.props.createAuction({
      data,
      success: ({ data }) => {
        this.props.history.push({
          pathname: `/admin/auctions/${data.pk}`
        })
      },
      fail: () => {
        this.setState({
          creatingStatus: -1
        })
      }
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
  }

  render() {
    const { adminProducts } = this.props
    const productListLoaded = adminProducts.get('productListLoaded')
    const productList = adminProducts.get('productList')
    const { creatingStatus } = this.state

    return (
      <AdminLayout>
        <div>
          <h3 className="mb-5">Create Auction</h3>

          {!productListLoaded && <Spinner />}

          {productListLoaded && <div>
            {creatingStatus === -1 && <div className="mb-2 text-danger">
              Failed to create auction
            </div>}

            <AuctionForm
              productList={productList}
              disabled={creatingStatus === 1}
              onSubmit={this.handleSubmit}
              onBack={this.handleBack}
            />
          </div>}
        </div>
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  adminProducts: adminProductsSelector,
})

const actions = {
  getProductList,
  createAuction,
}

export default compose(
  withRouter,
  connect(selector, actions)
)(AdminAuctionCreate)
