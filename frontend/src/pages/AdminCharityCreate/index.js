import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Immutable from 'immutable'
import RichTextEditor from 'react-rte'

import CharityForm from 'components/CharityForm'
import { formSubmit } from 'utils/form'
import {
  createCharity,
} from 'store/modules/admin/charities'


class AdminCharityCreate extends PureComponent {

  static propTypes = {
    createCharity: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  handleSubmit = (data) => {
    const { createCharity } = this.props

    const formData = data.set(
      'description',
      data.get('description').toString('html')
    )

    return formSubmit(createCharity, {
      id: this.props.match.params.id,
      data: formData,
      success: ({ data }) => {
        this.props.history.push({
          pathname: `/admin/charities/${data.pk}`
        })
      }
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/charities'
  })

  render() {
    const _charityDetail = Immutable.Map({
      description: RichTextEditor.createEmptyValue()
    })

    return (
      <div>
        <div>
          <h3 className="mb-5">Create Charity</h3>

          <CharityForm
            initialValues={_charityDetail}
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
