import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import Immutable from 'immutable'

import Pagination from 'components/Pagination'
import SectionTitle from 'components/SectionTitle'
import Spinner from 'components/Spinner'
import {
  getProductList,
  deleteProduct,
} from 'store/modules/admin/products'
import { adminProductsSelector } from 'store/selectors'
import { ADMIN_TABLE_PAGE_SIZE } from 'config'


class AdminProductList extends PureComponent {

  static propTypes = {
    adminProducts: ImmutablePropTypes.map.isRequired,
    getProductList: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1,
    page: 1,
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

  changePage = (page) => {
    const { loadingStatus } = this.state
    if (loadingStatus !== 10) {
      return
    }
    page = page < 1 ? 1 : page
    this.setState({ page })
  }

  currentPageProductList = () => {
    const { loadingStatus, page } = this.state
    if (loadingStatus !== 10) {
      return Immutable.List()
    }

    const { adminProducts } = this.props
    const productList = adminProducts.get('productList')
    return productList.slice((page - 1) * ADMIN_TABLE_PAGE_SIZE, page * ADMIN_TABLE_PAGE_SIZE)
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
    const { loadingStatus, page } = this.state

    return (
      <div>
        <div className="mb-3 clearfix">
          <SectionTitle className="pull-left">Products</SectionTitle>
          <Link className="btn btn-primary pull-right" to="/admin/products/create">Create</Link>
        </div>

        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.currentPageProductList().map(product => (
                <tr key={product.get('pk')}>
                  <th scope="row">{product.get('pk')}</th>
                  <td>{product.get('title')}</td>
                  <td>
                    <Link className="text-secondary pr-3" to={`/admin/products/${product.get('pk')}`}>Edit</Link>
                    <a className="text-danger" href="/" onClick={this.handleDelete.bind(this, product.get('pk'))}>Delete</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 text-center">
            <Pagination
              currentPage={page}
              totalCount={productList.size}
              pageSize={ADMIN_TABLE_PAGE_SIZE}
              onPage={this.changePage}
            />
          </div>
        </div>}
      </div>
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
