import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button, Card, CardBody, CardText, CardTitle, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedDate, FormattedNumber } from 'react-intl'
import { Link } from 'react-router-dom'
import { show } from 'redux-modal'

import auctionBidFlow from 'utils/auctionBidFlow'
import IconCheckCircle from 'icons/IconCheckCircle'
import IconTrash from 'icons/IconTrash'
import IconWarningCircle from 'icons/IconWarningCircle'
import TimeLeft from 'components/TimeLeft'
import { BID_STATUS_ACTIVE } from 'config'
import { deleteMyBid } from 'store/modules/account'


const COMPONENT_CLASS = 'bid-card'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class BidCard extends PureComponent {

  static propTypes = {
    bid: ImmutablePropTypes.map.isRequired,
    show: PropTypes.func,
    startBidFlow: PropTypes.func.isRequired
  }

  handleBid = () => {
    const { bid, startBidFlow } = this.props
    const pk = bid.get('auction')
    startBidFlow(pk)
  }

  handleDelete = () => {
    const { bid, deleteMyBid, show } = this.props
    show('confirmModal', {
      text: 'Are you sure to delete this bid?',
      onOk: () => deleteMyBid({ id: bid.get('pk') })
    })
  }

  renderActiveStatus() {
    const { bid } = this.props
    const price = bid.get('price')
    const currentPrice = bid.getIn(['auction_details', 'current_price'])
    return currentPrice > price ? (
      <div className={bem('status')}>
        <IconWarningCircle size="1.125rem" />
        <span className="ml-1 align-middle">You've been outbid. Make a new bid now.</span>
      </div>
    ) : (
      <div className={bem('status')}>
        <IconCheckCircle size="1.125rem" />
        <span className="ml-1 align-middle">Everything is ok. You are leading.</span>
      </div>
    )
  }

  renderActive() {
    const { bid } = this.props
    const { price, auction_details: auction } = bid.toJS()
    const { pk, title, open_until: openUntil } = auction

    return (
      <CardBody className={bem('body')}>
        <CardTitle className={bem('title')}>
          <Link to={`/auctions/${pk}`}>{title}</Link>
        </CardTitle>
        <CardText className={bem('text')} tag="div">
          <span className={bem('price')}>
            <FormattedNumber value={price} format="currency" />
          </span>
          <TimeLeft until={openUntil} />
          {this.renderActiveStatus()}
        </CardText>
        <Row>
          <Col md={6} lg={5}>
            <Button block color="primary" onClick={this.handleBid} className={bem('button')}>
              Bid Now
            </Button>
          </Col>
        </Row>
      </CardBody>
    )
  }

  renderInactive() {
    const { bid } = this.props
    const { price, auction_details: auction } = bid.toJS()
    const { pk, title, open_until: openUntil } = auction

    return (
      <CardBody className={bem('body')}>
        <CardTitle className={bem('title')}>
          <Link to={`/auctions/${pk}`}>{title}</Link>
        </CardTitle>
        <CardText className={bem('text')} tag="div">
          <span className={bem('price')}>
            <FormattedNumber value={price} format="currency" />
          </span>
          on{' '}
          <FormattedDate value={openUntil} format="dayMonthAndYear" />
        </CardText>
        <Button color="link" className={bem('remove')} onClick={this.handleDelete}>
          <IconTrash />
        </Button>
      </CardBody>
    )
  }

  render() {
    const { bid } = this.props
    const status = bid.get('status')
    const imgUrl = bid.getIn(['auction_details', 'product_details', 'media', 0, 'url'], '')

    return (
      <Card className={cx(COMPONENT_CLASS, 'gb')}>
        <div className={cx(bem('image'), 'card-img-top')} style={{ backgroundImage: `url(${imgUrl})`}} />
        {status === BID_STATUS_ACTIVE
          ? this.renderActive()
          : this.renderInactive()
        }
      </Card>
    )
  }
}

const actions = {
  deleteMyBid,
  show
}

export default compose(
  auctionBidFlow,
  connect(null, actions)
)(BidCard)
