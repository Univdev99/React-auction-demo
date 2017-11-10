import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Card, CardBody, CardSubtitle, Button } from 'reactstrap'
import { Link } from 'react-router-dom'

import auctionBidFlow from 'utils/auctionBidFlow'


const COMPONENT_CLASS = 'auction-card'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class AuctionCard extends PureComponent {

  static propTypes = {
    auction: PropTypes.object.isRequired,
    startBidFlow: PropTypes.func.isRequired
  }

  handleBid = () => {
    const { auction: { pk }, startBidFlow } = this.props
    startBidFlow(pk)
  }

  render() {
    const { auction: { pk, title, product_details: product } } = this.props

    return (
      <Card className={COMPONENT_CLASS}>
        <Link to={`/auctions/${pk}`}>
          <div className={cx(bem('image'), 'card-img-top')} style={{ backgroundImage: `url(${product.media[0].url})`}} />
        </Link>
        <CardBody>
          <CardSubtitle className={bem('title')} title={title}>{title}</CardSubtitle>
          <div className="mt-3">
            <Button outline block color='primary' onClick={this.handleBid} className={bem('button')}>
              Make a bid
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }
}

export default auctionBidFlow(AuctionCard)
