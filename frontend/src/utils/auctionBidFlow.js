import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isAuthenticatedSelector } from 'store/selectors'
import { show as abfShowModal } from 'redux-modal'

export default (WrappedComponent, selectData) => {
  class AuctionBidFlowComponent extends Component {
    static propTypes = {
      abfShowModal: PropTypes.func.isRequired,
      abfSignedIn: PropTypes.bool.isRequired
    }

    handleStart = (auctionId) => {
      const { abfSignedIn, abfShowModal } = this.props
      abfSignedIn
        ? abfShowModal('auctionBidModal', { auctionId })
        : abfShowModal('signinModal', { auctionId })
    }

    render() {
      const { abfSignedIn, abfShowModal, ...props } = this.props
      return <WrappedComponent {...props} startBidFlow={this.handleStart} />
    }
  }

  const selector = createStructuredSelector({
    abfSignedIn: isAuthenticatedSelector
  })

  const actions = {
    abfShowModal
  }

  return connect(selector, actions)(AuctionBidFlowComponent)
}
