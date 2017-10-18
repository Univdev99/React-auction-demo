import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'

import CharityForm from 'components/CharityForm'
import AdminLayout from 'pages/AdminLayout'
import {
  createCharity,
} from 'store/modules/admin/charities'
import { adminCharitiesSelector } from 'store/selectors'


class AdminCharityCreate extends PureComponent {

  static propTypes = {
    adminCharities: ImmutablePropTypes.map.isRequired,
    createCharity: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleSubmit = (data) => {
    this.props.createCharity({
      data,
      success: ({ data }) => {
        this.props.history.push({
          pathname: `/admin/charities/${data.pk}`
        })
      }
    })
  }

  render() {
    const { adminCharities } = this.props
    const creating = adminCharities.get('creating')
    const creatingError = adminCharities.get('creatingError')

    return (
      <AdminLayout>
        <div>
          <h3 className="mb-5">Create Charity</h3>

          {creatingError && <div className="mb-2 text-danger">
            Failed to create charity
          </div>}
          
          <CharityForm
            onSubmit={this.handleSubmit}
            disabled={creating}
          />
        </div>
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  adminCharities: adminCharitiesSelector,
})

const actions = {
  createCharity,
}

export default compose(
  withRouter,
  connect(selector, actions)
)(AdminCharityCreate)
