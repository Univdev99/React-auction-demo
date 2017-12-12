import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'

import AuctionForm from 'components/AuctionForm'
import SectionTitle from 'components/SectionTitle'
import Spinner from 'components/Spinner'
import { adminProductsSelector } from 'store/selectors'
import { createAuction } from 'store/modules/admin/auctions'
import { formSubmit } from 'utils/form'
import { getProductList, getProductDonorCharityList } from 'store/modules/admin/products'


class AdminAuctionCreate extends PureComponent {

  static propTypes = {
    adminProducts: ImmutablePropTypes.map.isRequired,
    getProductList: PropTypes.func.isRequired,
    getProductDonorCharityList: PropTypes.func.isRequired,
    createAuction: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleChangeProduct = (id) => {
    this.props.getProductDonorCharityList({ id })
  }

  handleSubmit = (data) => {
    const { createAuction, history } = this.props
    return formSubmit(createAuction, {
      data,
      success: ({ data }) => {
        history.push({
          pathname: `/admin/auctions/${data.pk}`
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
    const productDonorCharityList = adminProducts.get('productDonorCharityList')

    return (
      <div>
        <div>
          <SectionTitle className="mb-5">Create Auction</SectionTitle>

          {!productListLoaded && <Spinner />}

          {productListLoaded &&
            <AuctionForm
              productList={productList}
              onSubmit={this.handleSubmit}
              onBack={this.handleBack}
              getCharityList={this.handleChangeProduct}
              charityList={productDonorCharityList}
            />
          }
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminProducts: adminProductsSelector,
})

const actions = {
  getProductList,
  getProductDonorCharityList,
  createAuction,
}

export default compose(
  withRouter,
  connect(selector, actions)
)(AdminAuctionCreate)
