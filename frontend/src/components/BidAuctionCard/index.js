import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardText, CardTitle, Col, Row } from 'reactstrap'
import { FormattedNumber } from 'react-intl'
import { Link } from 'react-router-dom'

import auctionBidFlow from 'utils/auctionBidFlow'
import IconCheckCircle from 'icons/IconCheckCircle'
import IconTrash from 'icons/IconTrash'
import IconWarningCircle from 'icons/IconWarningCircle'
import TimeLeft from 'components/TimeLeft'
import { AUCTION_STATUS_OPEN } from 'config'

const COMPONENT_CLASS = 'bid-auction-card'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class BidAuctionCard extends PureComponent {

  static propTypes = {
    auction: PropTypes.object.isRequired,
    startBidFlow: PropTypes.func.isRequired
  }

  handleBid = () => {
    const { auction: { pk }, startBidFlow } = this.props
    startBidFlow(pk)
  }

  renderActiveStatus() {
    const { auction: { user_price: userPrice, current_price: currentPrice } } = this.props
    return currentPrice > userPrice ? (
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
    const { auction: { pk, title, open_until: openUntil, user_price: price } } = this.props

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
    const { auction: { pk, title, open_until: openUntil, user_price: price } } = this.props

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
          <TimeLeft until={openUntil} />
        </CardText>
        <Button color="link" className={bem('remove')}>
          <IconTrash />
        </Button>
      </CardBody>
    )
  }

  render() {
    const { auction: { product_details: product, status } } = this.props
    const imgUrl = product.media ? product.media[0].url : ''

    return (
      <Card className={cx(COMPONENT_CLASS, 'gb')}>
        <div className={cx(bem('image'), 'card-img-top')} style={{ backgroundImage: `url(${imgUrl})`}} />
        {status === AUCTION_STATUS_OPEN
          ? this.renderActive()
          : this.renderInactive()
        }
      </Card>
    )
  }
}

export default auctionBidFlow(BidAuctionCard)
