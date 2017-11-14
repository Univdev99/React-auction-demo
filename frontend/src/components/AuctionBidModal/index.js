import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Alert, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal, show as showModal } from 'redux-modal'
import { stopSubmit } from 'redux-form'

import { modalSelector } from 'store/selectors'
import AuctionBidForm from 'components/AuctionBidForm'
import { placeBid } from 'store/modules/auctions'

class AuctionBidModal extends PureComponent {
  static propTypes = {
    auctionId: PropTypes.number,
    handleHide: PropTypes.func.isRequired,
    placeBid: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired,
    stopSubmit: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      error: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show) {
      this.setState({ error: false })
    }
  }

  handleSubmit = (data) => {
    const { auctionId, handleHide, placeBid, showModal, stopSubmit } = this.props
    this.setState({ error: false })
    placeBid({
      id: auctionId,
      data: {
        price: parseInt(data.get('price'), 10)
      },
      success: () => {
        handleHide()
        showModal('auctionBidPlacedModal')
      },
      fail: ({ data }) => {
        this.setState({
          error: data.non_field_errors || 'Failed to place a bid'
        })
        stopSubmit('auctionBidForm', data)
      }
    })
  }

  render() {
    const { handleHide, show } = this.props
    const { error } = this.state

    return (
      <div>
        <Modal isOpen={show} toggle={handleHide} size="sm">
          <ModalHeader toggle={handleHide}>Are you sure?</ModalHeader>
          {error && <Alert color="danger">{error}</Alert>}
          <ModalBody>
            <p>Your credit card won't be charged now. Only if you win the auction</p>
            <AuctionBidForm onSubmit={this.handleSubmit} />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const actions = {
  placeBid,
  showModal,
  stopSubmit
}

export default compose(
  connect(null, actions),
  connectModal({
    name: 'auctionBidModal',
    destroyOnHide: false,
    getModalState: modalSelector
  })
)(AuctionBidModal)
