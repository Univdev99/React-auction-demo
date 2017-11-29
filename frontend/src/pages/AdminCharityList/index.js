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
  getCharityList,
  deleteCharity,
} from 'store/modules/admin/charities'
import { adminCharitiesSelector } from 'store/selectors'


class AdminCharityList extends PureComponent {

  static propTypes = {
    adminCharities: ImmutablePropTypes.map.isRequired,
    getCharityList: PropTypes.func.isRequired,
    deleteCharity: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1
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
    const { loadingStatus } = this.state

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

        {loadingStatus === 10 && <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {charityList.map(charity => (
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
        </table>}
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
