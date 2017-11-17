import React, { Component } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { authSelector, isAuthenticatedSelector } from 'store/selectors'
import { show as abfShowModal } from 'redux-modal'

export default (WrappedComponent, selectData) => {
  class AuctionBidFlowComponent extends Component {
    static propTypes = {
      abfAuth: ImmutablePropTypes.map.isRequired,
      abfShowModal: PropTypes.func.isRequired,
      abfSignedIn: PropTypes.bool.isRequired
    }

    handleStart = (auctionId) => {
      const { abfAuth, abfSignedIn, abfShowModal } = this.props
      const paymentInfo = abfAuth.getIn(['currentUser', 'payment_info'])
      abfSignedIn
        ? paymentInfo
          ? abfShowModal('auctionBidModal', { auctionId })
          : abfShowModal('auctionAddCardModal', { auctionId })
        : abfShowModal('signinModal', { auctionId })
    }

    render() {
      const { abfAuth, abfSignedIn, abfShowModal, ...props } = this.props
      return <WrappedComponent {...props} startBidFlow={this.handleStart} />
    }
  }

  const selector = createStructuredSelector({
    abfAuth: authSelector,
    abfSignedIn: isAuthenticatedSelector
  })

  const actions = {
    abfShowModal
  }

  return connect(selector, actions)(AuctionBidFlowComponent)
}
