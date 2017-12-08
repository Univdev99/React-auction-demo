import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { formSubmit } from 'utils/form'
import PasswordForm from 'components/PasswordForm'
import Section from 'components/Section'
import Spinner from 'components/Spinner'
import { authSelector } from 'store/selectors'
import { updatePassword } from 'store/modules/auth'


class AccountPassword extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    updatePassword: PropTypes.func.isRequired,
  }

  handleSubmit = (data) => {
    const { updatePassword } = this.props
    return formSubmit(updatePassword, { data })
  }

  render() {
    const { auth } = this.props
    const currentUser = auth.get('currentUser')

    if (!currentUser) {
      return <Spinner />
    }

    return (
      <Section title="Change Password">
        <PasswordForm onSubmit={this.handleSubmit} />
      </Section>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
})

const actions = {
  updatePassword,
}

export default compose(
  connect(selector, actions)
)(AccountPassword)
