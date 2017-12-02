import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import SectionTitle from 'components/SectionTitle'
import Spinner from 'components/Spinner'
import {
  getDonorDetail,
  getDonorProductList,
} from 'store/modules/admin/donors'
import { deleteProduct } from 'store/modules/admin/products'
import { adminDonorsSelector } from 'store/selectors'


class AdminDonorProductList extends PureComponent {

  static propTypes = {
    adminDonors: ImmutablePropTypes.map.isRequired,
    getDonorDetail: PropTypes.func.isRequired,
    getDonorProductList: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    loadingDonorStatus: 0,
    loadingProductListStatus: 1,
  }

  handleDelete = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to delete this product?')) {
      return
    }

    this.props.deleteProduct({
      id,
      success: () => {
        this._getDonorProductList()
      },
      fail: () => {
        alert('Failed to delete product')
      },
    })
  }

  _getDonorDetail = () => {
    this.setState({
      loadingDonorStatus: 1
    })

    this.props.getDonorDetail({
      id: this.props.match.params.id,
      success: () => this.setState({
        loadingDonorStatus: 10
      }),
      fail: () => this.setState({
        loadingDonorStatus: -1
      }),
    })
  }

  _getDonorProductList = () => {
    this.setState({
      loadingProductListStatus: 1
    })

    this.props.getDonorProductList({
      id: this.props.match.params.id,
      success: () => this.setState({
        loadingProductListStatus: 10
      }),
      fail: () => this.setState({
        loadingProductListStatus: -1
      }),
    })
  }

  componentWillMount() {
    const { adminDonors } = this.props

    if (!adminDonors.get('donorDetail')) {
      this._getDonorDetail()
    }

    this._getDonorProductList()
  }

  render() {
    const { adminDonors } = this.props
    const donorDetail = adminDonors.get('donorDetail')
    const donorProductList = adminDonors.get('donorProductList')
    const { loadingDonorStatus, loadingProductListStatus } = this.state

    if (loadingDonorStatus === -1) {
      return (
        <div>
          <SectionTitle>Donor not found</SectionTitle>
        </div>
      )
    }

    return (
      <div>
        <div>
          {(loadingDonorStatus === 1 || loadingProductListStatus === 1 || !donorDetail) && <Spinner />}

          {loadingProductListStatus === -1 && <div className="text-danger">
            Failed to get products of this donor
          </div>}

          {loadingProductListStatus === 10 && donorDetail && <div>
            <SectionTitle className="mb-5">Products from {donorDetail.get('title')}</SectionTitle>

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donorProductList.map(product => (
                  <tr key={product.get('pk')}>
                    <th scope="row">{product.get('pk')}</th>
                    <td>{product.get('title')}</td>
                    <td>{product.get('description')}</td>
                    <td>
                      <Link className="text-secondary pr-3" to={`/admin/products/${product.get('pk')}`}>Edit</Link>
                      <a className="text-danger" href="/" onClick={this.handleDelete.bind(this, product.get('pk'))}>Delete</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminDonors: adminDonorsSelector,
})

const actions = {
  getDonorDetail,
  getDonorProductList,
  deleteProduct,
}

export default compose(
  connect(selector, actions)
)(AdminDonorProductList)
