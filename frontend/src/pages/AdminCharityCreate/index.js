import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import CharityForm from 'components/CharityForm'
import AdminLayout from 'pages/AdminLayout'
import {
  createCharity,
} from 'store/modules/admin/charities'


class AdminCharityCreate extends PureComponent {

  static propTypes = {
    createCharity: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    creatingStatus: 0,
  }

  handleSubmit = (data) => {
    this.setState({
      creatingStatus: 1
    })
    this.props.createCharity({
      data,
      success: ({ data }) => {
        this.props.history.push({
          pathname: `/admin/charities/${data.pk}`
        })
      },
      fail: () => {
        this.setState({
          creatingStatus: -1
        })
      }
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/charities'
  })

  render() {
    const { creatingStatus } = this.state

    return (
      <AdminLayout>
        <div>
          <h3 className="mb-5">Create Charity</h3>

          {creatingStatus === -1 && <div className="mb-2 text-danger">
            Failed to create charity
          </div>}
          
          <CharityForm
            disabled={creatingStatus === 1}
            onSubmit={this.handleSubmit}
            onBack={this.handleBack}
          />
        </div>
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
})

const actions = {
  createCharity,
}

export default compose(
  withRouter,
  connect(selector, actions)
)(AdminCharityCreate)
