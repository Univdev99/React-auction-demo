import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardText, CardTitle, Col } from 'reactstrap'
import { Link } from 'react-router-dom'

import auctionBidFlow from 'utils/auctionBidFlow'
import TimeLeft from 'components/TimeLeft'


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
    const { auction: { pk, title, product_details: product, open_until: openUntil } } = this.props

    return (
      <Col xs={12} md={6} lg={3} className="gb">
        <Card className={COMPONENT_CLASS}>
          <Link to={`/auctions/${pk}`}>
            <div className={cx(bem('image'), 'card-img-top')} style={{ backgroundImage: `url(${product.media[0].url})`}} />
          </Link>
          <CardBody>
            <CardTitle className={bem('title')}>
              {title}
            </CardTitle>
            <CardText><TimeLeft until={openUntil} /></CardText>
            <div className="mt-3">
              <Button block color='primary' onClick={this.handleBid} className={bem('button')}>
                Make a bid
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default auctionBidFlow(AuctionCard)
