import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Spinner from 'components/Spinner'
import Uploader from 'components/Uploader'
import ProductForm from 'components/ProductForm'
import SortableMediaList from 'components/SortableMediaList'
import { getDonorList } from 'store/modules/admin/donors'
import {
  getProductDetail,
  updateProductDetail,
  uploadProductMedium,
  deleteProductMedium,
  reorderProductMedia,
} from 'store/modules/admin/products'
import { adminDonorsSelector, adminProductsSelector } from 'store/selectors'


class AdminProductDetail extends PureComponent {

  static propTypes = {
    adminDonors: ImmutablePropTypes.map.isRequired,
    adminProducts: ImmutablePropTypes.map.isRequired,
    getDonorList: PropTypes.func.isRequired,
    getProductDetail: PropTypes.func.isRequired,
    updateProductDetail: PropTypes.func.isRequired,
    uploadProductMedium: PropTypes.func.isRequired,
    deleteProductMedium: PropTypes.func.isRequired,
    reorderProductMedia: PropTypes.func.isRequired,
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
      success: this.handleBack,
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

    if (!window.confirm('Are you sure to delete this medium?')) {
      return
    }

    this.props.deleteProductMedium({
      id: this.props.match.params.id,
      pmId,
    })
  }

  getMedia = () => {
    const { adminProducts } = this.props
    const reorderedTemporaryProductMedia = adminProducts.get('reorderedTemporaryProductMedia')
    if (reorderedTemporaryProductMedia) {
      return reorderedTemporaryProductMedia
    }
    return adminProducts.getIn(['productDetail', 'media'])
  }

  handleDragEnd = (result) => {
    const { adminProducts } = this.props
    const productDetail = adminProducts.get('productDetail')
    const media = productDetail.get('media')
    const draggedMedium = media.get(result.source.index)
    const newMedia = media.delete(result.source.index)
      .insert(result.destination.index, draggedMedium)

    this.props.reorderProductMedia({
      id: this.props.match.params.id,
      newMedia,
      data: {
        media_order: newMedia.map(medium => medium.get('pk')).toJS()
      }
    })
  }

  renderMediaDropzone = () => {
    const productMedia = this.getMedia()

    return (
      <div className="form-group">
        <label className="mb-4">Add, remove or change order of images, audio and video:</label>
        <SortableMediaList
          media={productMedia}
          onDragEnd={this.handleDragEnd}
          onDelete={this.handleDeleteProductMedium}
        />

        <div className="mt-3">
          <Uploader
            uploadAction={this.props.uploadProductMedium}
            uploadActionParams={{ id: this.props.match.params.id }}
          />
        </div>
      </div>
    )
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
        <div>
          <h2>Product not found</h2>
        </div>
      )
    }

    return (
      <div>
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
              renderMediaDropzone={this.renderMediaDropzone}
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
  adminDonors: adminDonorsSelector,
  adminProducts: adminProductsSelector,
})

const actions = {
  getDonorList,
  getProductDetail,
  updateProductDetail,
  uploadProductMedium,
  deleteProductMedium,
  reorderProductMedia,
}

export default compose(
  connect(selector, actions)
)(AdminProductDetail)
