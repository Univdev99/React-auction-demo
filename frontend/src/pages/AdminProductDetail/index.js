import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import RichTextEditor from 'react-rte'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { formSubmit } from 'utils/form'
import SectionTitle from 'components/SectionTitle'
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
  }

  handleSubmit = (data) => {
    const { match, updateProductDetail } = this.props
    const formData = data.set(
      'description',
      data.get('description').toString('html')
    )
    return formSubmit(updateProductDetail, {
      id: match.params.id,
      data: formData,
      success: this.handleBack,
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
        <h4 className="mb-3">Add images, video or audio:</h4>
        <div className="image-upload">
          <Uploader
            uploadAction={this.props.uploadProductMedium}
            uploadActionParams={{ id: this.props.match.params.id }}
          />

          <div className="mt-3">
            <SortableMediaList
              media={productMedia}
              onDragEnd={this.handleDragEnd}
              onDelete={this.handleDeleteProductMedium}
            />
          </div>
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
          <SectionTitle>Product not found</SectionTitle>
        </div>
      )
    }

    let _productDetail = null
    if (productDetail) {
      _productDetail = productDetail.delete('pk')
      _productDetail = _productDetail.set(
        'description',
        RichTextEditor.createValueFromString(_productDetail.get('description'), 'html')
      )
    } else {
      _productDetail = Immutable.Map({
        description: RichTextEditor.createEmptyValue()
      })
    }

    return (
      <div>
        <div>
          <SectionTitle className="mb-5">Edit Product</SectionTitle>

          {(loadingStatus === 1 || !productDetail || !donorListLoaded) && <Spinner />}

          {loadingStatus === 10 && productDetail && donorListLoaded &&
            <ProductForm
              initialValues={_productDetail}
              donorList={donorList}
              disabled={updatingStatus === 1}
              renderMediaDropzone={this.renderMediaDropzone}
              onSubmit={this.handleSubmit}
              onBack={this.handleBack}
            />
          }
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
