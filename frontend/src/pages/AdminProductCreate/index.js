import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'

import ProductForm from 'components/ProductForm'
import Spinner from 'components/Spinner'
import AdminLayout from 'pages/AdminLayout'
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

  state = {
    creatingStatus: 0,
  }

  handleSubmit = (data) => {
    this.setState({
      creatingStatus: 1
    })
    this.props.createProduct({
      data,
      success: ({ data }) => {
        this.props.history.push({
          pathname: `/admin/products/${data.pk}`
        })
      },
      fail: () => {
        this.setState({
          creatingStatus: -1
        })
      }
    })
  }

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
    const { creatingStatus } = this.state

    return (
      <AdminLayout>
        <div>
          <h3 className="mb-5">Create Product</h3>

          {!donorListLoaded && <Spinner />}

          {donorListLoaded && <div>
            {creatingStatus === -1 && <div className="mb-2 text-danger">
              Failed to create product
            </div>}
            
            <ProductForm
              donorList={donorList}
              disabled={creatingStatus === 1}
              onSubmit={this.handleSubmit}
            />
          </div>}
        </div>
      </AdminLayout>
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
