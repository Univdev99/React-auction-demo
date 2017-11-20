import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Alert } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import AccountForm from 'components/AccountForm'
import { formSubmit } from 'utils/form'
import Spinner from 'components/Spinner'
import { authSelector, countriesSelector } from 'store/selectors'
import { getCountries } from 'store/modules/settings'
import { updateCurrentUser } from 'store/modules/auth'


class AccountInfo extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    countries: PropTypes.array.isRequired,
    getCountries: PropTypes.func.isRequired,
    updateCurrentUser: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      updateStatus: 0
    }
  }

  componentDidMount() {
    const { getCountries } = this.props
    getCountries()
  }

  handleSubmit = (data) => {
    const { updateCurrentUser } = this.props
    this.setState({
      updateStatus: 1
    })

    return formSubmit(updateCurrentUser, {
      data,
      success: () => this.setState({
        updateStatus: 10
      })
    })
  }

  render() {
    const { auth, countries } = this.props
    const currentUser = auth.get('currentUser')

    if (!currentUser) {
      return <Spinner />
    }

    const { updateStatus } = this.state

    return (
      <div>
        <h3 className="mb-4">Account Information</h3>

        {updateStatus === 10 && <Alert color="success">
          Successfully saved
        </Alert>}

        <AccountForm
          countries={countries}
          initialValues={currentUser}
          onSubmit={this.handleSubmit}
        />

      </div>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
  countries: countriesSelector
})

const actions = {
  getCountries,
  updateCurrentUser
}

export default compose(
  connect(selector, actions)
)(AccountInfo)
