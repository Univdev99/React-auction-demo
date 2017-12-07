import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { show } from 'redux-modal'

class EmptyItems extends PureComponent {
  static PropTypes = {
    actionText: PropTypes.string,
    description: PropTypes.string
  }

  handleClick = (event) => {
    const { show } = this.props
    event.preventDefault()
    show('subscribeModal')
  }

  render() {
    const { actionText, description } = this.props

    return (
      <h4>
        {description}
        {' '}
        <a href="/" onClick={this.handleClick}>{actionText}</a>
      </h4>
    )
  }
}

const actions = {
  show
}

export default connect(null, actions)(EmptyItems)
