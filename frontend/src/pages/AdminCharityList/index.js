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
  getCharityList,
  deleteCharity,
} from 'store/modules/admin/charities'
import { adminCharitiesSelector } from 'store/selectors'
import { ADMIN_TABLE_PAGE_SIZE } from 'config'


class AdminCharityList extends PureComponent {

  static propTypes = {
    adminCharities: ImmutablePropTypes.map.isRequired,
    getCharityList: PropTypes.func.isRequired,
    deleteCharity: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1,
    page: 1,
  }

  changePage = (page) => {
    const { loadingStatus } = this.state
    if (loadingStatus !== 10) {
      return
    }
    page = page < 1 ? 1 : page
    this.setState({ page })
  }

  currentPageList = () => {
    const { loadingStatus, page } = this.state
    if (loadingStatus !== 10) {
      return Immutable.List()
    }

    const { adminCharities } = this.props
    const charityList = adminCharities.get('charityList')
    return charityList.slice((page - 1) * ADMIN_TABLE_PAGE_SIZE, page * ADMIN_TABLE_PAGE_SIZE)
  }

  handleDelete = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to delete this charity?')) {
      return
    }

    this.props.deleteCharity({
      id,
      success: () => {
        this.props.getCharityList()
      },
      fail: () => {
        alert('Failed to delete charity')
      },
    })
  }

  componentWillMount() {
    this.setState({
      loadingStatus: 1
    })

    this.props.getCharityList({
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  render() {
    const { adminCharities } = this.props
    const charityList = adminCharities.get('charityList')
    const { loadingStatus, page } = this.state

    return (
      <div>
        <div className="mb-5 clearfix">
          <SectionTitle className="pull-left">Charities</SectionTitle>
          <Link className="btn btn-primary pull-right" to="/admin/charities/create">Create</Link>
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
              {this.currentPageList().map(charity => (
                <tr key={charity.get('pk')}>
                  <th scope="row">{charity.get('pk')}</th>
                  <td>{charity.get('title')}</td>
                  <td>
                    <Link className="text-secondary pr-3" to={`/admin/charities/${charity.get('pk')}`}>Edit</Link>
                    <a className="text-danger" href="/" onClick={this.handleDelete.bind(this, charity.get('pk'))}>Delete</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 text-center">
            <Pagination
              currentPage={page}
              totalCount={charityList.size}
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
  adminCharities: adminCharitiesSelector,
})

const actions = {
  getCharityList,
  deleteCharity,
}

export default compose(
  connect(selector, actions)
)(AdminCharityList)
