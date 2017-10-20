import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import Spinner from 'components/Spinner'
import AdminLayout from 'pages/AdminLayout'
import {
  getProductList,
  deleteProduct,
} from 'store/modules/admin/products'
import { adminProductsSelector } from 'store/selectors'


class AdminProductList extends PureComponent {

  static propTypes = {
    adminProducts: ImmutablePropTypes.map.isRequired,
    getProductList: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1
  }

  handleDelete = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to delete this product?')) {
      return
    }

    this.props.deleteProduct({
      id,
      success: () => {
        this.props.getProductList()
      },
      fail: () => {
        alert('Failed to delete product')
      },
    })
  }

  componentWillMount() {
    this.setState({
      loadingStatus: 1
    })

    this.props.getProductList({
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  render() {
    const { adminProducts } = this.props
    const productList = adminProducts.get('productList')
    const { loadingStatus } = this.state

    return (
      <AdminLayout>
        <div className="mb-4 clearfix">
          <h2 className="pull-left">Products</h2>
          <Link className="btn btn-primary pull-right" to="/admin/products/create">Create</Link>
        </div>

        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map(product => (
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
        </table>}
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  adminProducts: adminProductsSelector,
})

const actions = {
  getProductList,
  deleteProduct,
}

export default compose(
  connect(selector, actions)
)(AdminProductList)
