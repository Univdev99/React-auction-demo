import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Card, CardBody, CardSubtitle, Button } from 'reactstrap'
import { Link } from 'react-router-dom'

import './style.css'

const bem = (suffix) => `card__${suffix}`

class AuctionCard extends PureComponent {

  static propTypes = {
    auction: PropTypes.object.isRequired
  }

  render() {
    const { auction: { pk, title, product_details: product } } = this.props
    console.log(this.props)

    return (
      <Card>
        <div className={cx(bem('image'), 'card-img-top')} style={{ backgroundImage: `url(${product.media[0].url})`}} />
        <CardBody>
          <CardSubtitle className={bem('title')} title={title}>{title}</CardSubtitle>
          <div className="mt-3">
            <Button tag={Link} outline block color='primary' to={`/auctions/${pk}`} className={bem('button')}>
              Make a bid
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }
}

export default AuctionCard
