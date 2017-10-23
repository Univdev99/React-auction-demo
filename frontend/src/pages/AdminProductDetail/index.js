import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Spinner from 'components/Spinner'
import Uploader from 'components/Uploader'
import ProductForm from 'components/ProductForm'
import AdminLayout from 'pages/AdminLayout'
import { getDonorList } from 'store/modules/admin/donors'
import {
  getProductDetail,
  updateProductDetail,
  uploadProductMedium,
  deleteProductMedium,
} from 'store/modules/admin/products'
import { adminDonorsSelector, adminProductsSelector } from 'store/selectors'
import './style.css'


class AdminProductDetail extends PureComponent {

  static propTypes = {
    adminDonors: ImmutablePropTypes.map.isRequired,
    adminProducts: ImmutablePropTypes.map.isRequired,
    getDonorList: PropTypes.func.isRequired,
    getProductDetail: PropTypes.func.isRequired,
    updateProductDetail: PropTypes.func.isRequired,
    uploadProductMedium: PropTypes.func.isRequired,
    deleteProductMedium: PropTypes.func.isRequired,
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

  handleDeleteProductMedium = (pmId, event) => {
    event.preventDefault()

    this.props.deleteProductMedium({
      id: this.props.match.params.id,
      pmId,
    })
  }

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

            <div className="mt-4">
              <label>Product images and videos:</label>
              <div>
                {productDetail.get('media').map(medium => (
                  <div key={medium.get('pk')} className="product-medium mr-3 mb-3">
                    <a href="/" className="btn-product-medium-delete" onClick={this.handleDeleteProductMedium.bind(this, medium.get('pk'))}>
                      <i className="fa fa-times"></i>
                    </a>
                    {
                      medium.getIn(['medium', 'type']) === 'video' ?
                      <video className="img-fluid" src={medium.getIn(['medium', 'url'])} />
                      :
                      <img className="img-fluid" src={medium.getIn(['medium', 'url'])} alt="Product Medium" />
                    }
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label>Upload new image or video:</label>
                <Uploader
                  uploadAction={this.props.uploadProductMedium}
                  uploadActionParams={{ id: this.props.match.params.id }}
                />
              </div>
            </div>
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
  uploadProductMedium,
  deleteProductMedium,
}

export default compose(
  connect(selector, actions)
)(AdminProductDetail)
