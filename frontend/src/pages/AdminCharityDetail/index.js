import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Spinner from 'components/Spinner'
import CharityForm from 'components/CharityForm'
import AdminLayout from 'pages/AdminLayout'
import { getCharityDetail } from 'store/modules/admin/charities'
import { adminCharitiesSelector } from 'store/selectors'


class AdminCharityDetail extends PureComponent {

  static propTypes = {
    adminCharities: ImmutablePropTypes.map.isRequired,
    getCharityDetail: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  handleSubmit = (data) => {
    console.log(data)///
  }

  componentWillMount() {
    this.props.getCharityDetail({
      id: this.props.match.params.id
    })
  }

  render() {
    const { adminCharities } = this.props
    const charityDetail = adminCharities.get('charityDetail')
    const loadingCharityDetail = adminCharities.get('loadingCharityDetail')
    const loadingCharityDetailError = adminCharities.get('loadingCharityDetailError')

    if (loadingCharityDetail) {
      return (
        <AdminLayout>
          <Spinner />
        </AdminLayout>
      )
    }

    if (loadingCharityDetailError) {
      return (
        <AdminLayout>
          <h2>Charity not found</h2>
        </AdminLayout>
      )
    }

    return (
      <AdminLayout>
        <div>
          <h3 className="mb-5">Edit Charity</h3>
          
          <CharityForm initialValues={charityDetail} onSubmit={this.handleSubmit} />
        </div>
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  adminCharities: adminCharitiesSelector,
})

const actions = {
  getCharityDetail,
}

export default compose(
  connect(selector, actions)
)(AdminCharityDetail)
