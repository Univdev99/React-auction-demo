import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import Spinner from 'components/Spinner'
import {
  getDonorList,
  deleteDonor,
} from 'store/modules/admin/donors'
import { adminDonorsSelector } from 'store/selectors'


class AdminDonorList extends PureComponent {

  static propTypes = {
    adminDonors: ImmutablePropTypes.map.isRequired,
    getDonorList: PropTypes.func.isRequired,
    deleteDonor: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1
  }

  handleDelete = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to delete this donor?')) {
      return
    }

    this.props.deleteDonor({
      id,
      success: () => {
        this.props.getDonorList()
      },
      fail: () => {
        alert('Failed to delete donor')
      },
    })
  }

  componentWillMount() {
    this.setState({
      loadingStatus: 1
    })

    this.props.getDonorList({
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
    const donorList = adminDonors.get('donorList')
    const { loadingStatus } = this.state

    return (
      <div>
        <div className="mb-5 clearfix">
          <h2 className="pull-left">Donors</h2>
          <Link className="btn btn-primary pull-right" to="/admin/donors/create">Create</Link>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donorList.map(donor => (
              <tr key={donor.get('pk')}>
                <th scope="row">{donor.get('pk')}</th>
                <td>{donor.get('title')}</td>
                <td>
                  <Link className="text-secondary pr-3" to={`/admin/donors/${donor.get('pk')}`}>Edit</Link>
                  <a className="text-danger" href="/" onClick={this.handleDelete.bind(this, donor.get('pk'))}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminDonors: adminDonorsSelector,
})

const actions = {
  getDonorList,
  deleteDonor,
}

export default compose(
  connect(selector, actions)
)(AdminDonorList)
