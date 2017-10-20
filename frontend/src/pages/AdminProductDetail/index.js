import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Spinner from 'components/Spinner'
/// import Uploader from 'components/Uploader'
import ProductForm from 'components/ProductForm'
import AdminLayout from 'pages/AdminLayout'
import { getDonorList } from 'store/modules/admin/donors'
import {
  getProductDetail,
  updateProductDetail,
} from 'store/modules/admin/products'
import { adminDonorsSelector, adminProductsSelector } from 'store/selectors'


class AdminProductDetail extends PureComponent {

  static propTypes = {
    adminDonors: ImmutablePropTypes.map.isRequired,
    adminProducts: ImmutablePropTypes.map.isRequired,
    getDonorList: PropTypes.func.isRequired,
    getProductDetail: PropTypes.func.isRequired,
    updateProductDetail: PropTypes.func.isRequired,
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

    this.props.updateProductDetail({
      id: this.props.match.params.id,
      data,
      success: () => this.setState({
        updatingStatus: 10
      }),
      fail: () => this.setState({
        updatingStatus: -1
      }),
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/products'
  })

  componentWillMount() {
    const { adminDonors } = this.props
    const donorListLoaded = adminDonors.get('donorListLoaded')
    if (!donorListLoaded) {
      this.props.getDonorList()
    }

    this.setState({
      loadingStatus: 1
    })

    this.props.getProductDetail({
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
    const { adminDonors } = this.props
    const donorListLoaded = adminDonors.get('donorListLoaded')
    const donorList = adminDonors.get('donorList')
    const { adminProducts } = this.props
    const productDetail = adminProducts.get('productDetail')
    const { loadingStatus, updatingStatus } = this.state

    if (loadingStatus === -1) {
      return (
        <AdminLayout>
          <h2>Product not found</h2>
        </AdminLayout>
      )
    }

    return (
      <AdminLayout>
        <div>
          <h3 className="mb-5">Edit Product</h3>

          {(loadingStatus === 1 || !productDetail || !donorListLoaded) && <Spinner />}

          {loadingStatus === 10 && productDetail && donorListLoaded && <div>
            {/*<div className="mb-4">
              <label>Upload logo here:</label>
              <Uploader
                uploadAction={this.props.uploadProductLogo}
                uploadActionParams={{ id: this.props.match.params.id }}
                defaultImageURL={productDetail.get('logo')}
              />
            </div>*/}

            {updatingStatus === -1 && <div className="mb-2 text-danger">
              Failed to update product
            </div>}
            
            <ProductForm
              initialValues={productDetail.delete('pk')}
              donorList={donorList}
              disabled={updatingStatus === 1}
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
  adminDonors: adminDonorsSelector,
  adminProducts: adminProductsSelector,
})

const actions = {
  getDonorList,
  getProductDetail,
  updateProductDetail,
}

export default compose(
  connect(selector, actions)
)(AdminProductDetail)
