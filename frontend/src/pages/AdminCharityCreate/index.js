import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Immutable from 'immutable'
import RichTextEditor from 'react-rte'

import CharityForm from 'components/CharityForm'
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
    const formData = data.set(
      'description',
      data.get('description').toString('html')
    )

    this.setState({
      creatingStatus: 1
    })

    this.props.createCharity({
      data: formData,
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

    const _charityDetail = Immutable.Map({
      description: RichTextEditor.createEmptyValue()
    })

    return (
      <div>
        <div>
          <h3 className="mb-5">Create Charity</h3>

          {creatingStatus === -1 && <div className="mb-2 text-danger">
            Failed to create charity
          </div>}

          <CharityForm
            initialValues={_charityDetail}
            disabled={creatingStatus === 1}
            onSubmit={this.handleSubmit}
            onBack={this.handleBack}
          />
        </div>
      </div>
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
