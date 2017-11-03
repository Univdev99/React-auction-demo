import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Button, Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import TimeLeft from 'components/TimeLeft'
import { accountSelector } from 'store/selectors'
import { getMyBids } from 'store/modules/account'


class AccountBids extends PureComponent {
  static propTypes = {
    account: ImmutablePropTypes.map.isRequired
  };

  componentDidMount() {
    const { getMyBids } = this.props
    getMyBids()
  }

  render() {
    const { account } = this.props
    const bidAuctionsList = account.get('bidAuctionsList')

    return (
      <div>
        <h3 className="mb-4">My Bids</h3>

        {bidAuctionsList.map((item, index) => (
          <Row key={index} className="align-items-center mb-3">
            <Col md={6} xs={12} className="mb-3 text-center">
              <img
                className="mw-100"
                src={item.getIn(['product_details', 'media', 0, 'url'], '')}
                alt={item.get('title')}
              />
            </Col>
            <Col md={6} xs={12} className="mb-3 text-center text-md-left">
              <h5>{item.get('title')}</h5>
              <div className="mb-3">
                Time Left: <TimeLeft until={item.get('open_until')} />
              </div>
              <Button color="primary">Place a new bid</Button>
            </Col>
          </Row>
        ))}
      </div>
    )
  }
}

const selector = createStructuredSelector({
  account: accountSelector
})

const actions = {
  getMyBids
}

export default compose(
  connect(selector, actions)
)(AccountBids)
