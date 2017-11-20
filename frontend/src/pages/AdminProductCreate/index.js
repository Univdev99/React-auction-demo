import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import RichTextEditor from 'react-rte'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'

import { formSubmit } from 'utils/form'
import ProductForm from 'components/ProductForm'
import Spinner from 'components/Spinner'
import { getDonorList } from 'store/modules/admin/donors'
import { createProduct } from 'store/modules/admin/products'
import { adminDonorsSelector } from 'store/selectors'


class AdminProductCreate extends PureComponent {

  static propTypes = {
    adminDonors: ImmutablePropTypes.map.isRequired,
    getDonorList: PropTypes.func.isRequired,
    createProduct: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleSubmit = (data) => {
    const { createProduct, history } = this.props
    const formData = data.set(
      'description',
      data.get('description').toString('html')
    )

    return formSubmit(createProduct, {
      data: formData,
      success: ({ data }) => {
        history.push({
          pathname: `/admin/products/${data.pk}`
        })
      }
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
  }

  render() {
    const { adminDonors } = this.props
    const donorListLoaded = adminDonors.get('donorListLoaded')
    const donorList = adminDonors.get('donorList')

    const _productDetail = Immutable.Map({
      description: RichTextEditor.createEmptyValue()
    })

    return (
      <div>
        <div>
          <h3 className="mb-5">Create Product</h3>

          {!donorListLoaded && <Spinner />}

          {donorListLoaded &&
            <ProductForm
              initialValues={_productDetail}
              donorList={donorList}
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
})

const actions = {
  getDonorList,
  createProduct,
}

export default compose(
  withRouter,
  connect(selector, actions)
)(AdminProductCreate)
