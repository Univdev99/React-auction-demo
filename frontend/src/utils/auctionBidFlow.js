import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isAuthenticatedSelector } from 'store/selectors'
import { show } from 'redux-modal'

export default (WrappedComponent, selectData) => {
  class AuctionBidFlowComponent extends Component {
    static propTypes = {
      show: PropTypes.func.isRequired,
      signedIn: PropTypes.bool.isRequired
    }

    handleStart = (auctionId) => {
      const { signedIn, show } = this.props
      signedIn
        ? show('auctionBidModal', { auctionId })
        : show('signinModal', { auctionId })
    }

    render() {
      return <WrappedComponent {...this.props} startBidFlow={this.handleStart} />
    }
  }

  const selector = createStructuredSelector({
    signedIn: isAuthenticatedSelector
  })

  const actions = {
    show
  }

  return connect(selector, actions)(AuctionBidFlowComponent)
}
