import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardText, CardTitle, CardSubtitle, Col } from 'reactstrap'
import { FormattedNumber } from 'react-intl'
import { Link } from 'react-router-dom'

import auctionBidFlow from 'utils/auctionBidFlow'
import TimeLeft from 'components/TimeLeft'
import { stripTags, truncateWords } from 'utils/pureFunctions'


const COMPONENT_CLASS = 'auction-card'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class AuctionCard extends PureComponent {

  static propTypes = {
    auction: PropTypes.object.isRequired,
    startBidFlow: PropTypes.func.isRequired
  }

  handleBid = () => {
    const { auction, startBidFlow } = this.props
    startBidFlow(auction.get('pk'))
  }

  render() {
    const { auction } = this.props
    const { pk, title, open_until: openUntil, current_price: price } = auction.toJS()
    const linkTo = `/auctions/${pk}`
    const donor = auction.getIn(['product_details', 'donor_details'])
    const description = auction.getIn(['product_details', 'description'])

    return (
      <Col xs={12} md={6} lg={3} className="gb align-self-stretch">
        <Card className={COMPONENT_CLASS}>
          <Link to={linkTo}>
            <div
              className={cx(bem('image'), 'card-img-top')}
              style={{ backgroundImage: `url(${auction.getIn(['product_details', 'media', 0, 'url'])})` }}
            />
          </Link>
          <CardBody className={bem('body')}>
            <CardTitle className={bem('title')}>
              <Link to={linkTo}>{title}</Link>
            </CardTitle>
            <CardSubtitle className={bem('subtitle')}>
              By: {donor.get('title')}
            </CardSubtitle>
            <CardText className={bem('desc')}>
              {truncateWords(stripTags(description))}
            </CardText>
            <CardText className={bem('meta')}>
              <span className={bem('price')}>
                <FormattedNumber value={price} format='currency' />
              </span>
              <TimeLeft until={openUntil} />
            </CardText>
            <div className="mt-3">
              <Button block color='primary' onClick={this.handleBid} className={bem('button')}>
                Bid Now
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default auctionBidFlow(AuctionCard)
