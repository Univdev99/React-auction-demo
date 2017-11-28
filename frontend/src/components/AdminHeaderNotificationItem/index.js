import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { DropdownItem } from 'reactstrap'

import {
  // NOTIFICATION_TYPE_AUCTION,
  NOTIFICATION_AUCTION_NEW,
  NOTIFICATION_AUCTION_NEW_BID,
  NOTIFICATION_AUCTION_CLOSE,
  NOTIFICATION_AUCTION_PAYMENT,
  NOTIFICATION_ENTITY_CONTENT_TYPE_AUCTION,
  NOTIFICATION_ENTITY_CONTENT_TYPE_USER,
} from 'config'


class AdminHeaderNotificationItem extends PureComponent {

  static propTypes = {
    notification: ImmutablePropTypes.map.isRequired,
  }

  templates = {
    [NOTIFICATION_AUCTION_NEW]: 'New auction %s created',
    [NOTIFICATION_AUCTION_NEW_BID]: '%s placed a bid on %t',
    [NOTIFICATION_AUCTION_CLOSE]: 'Auction %s closed',
    [NOTIFICATION_AUCTION_PAYMENT]: 'Payment received for auction %s',
  }

  objectRepresentation = (object) => {
    if (!object) {
      return ''
    } else if (object.get('content_type') === NOTIFICATION_ENTITY_CONTENT_TYPE_AUCTION) {
      return (
        `<span class="text-primary">${object.get('title')}</span>`
      )
    } else if (object.get('content_type') === NOTIFICATION_ENTITY_CONTENT_TYPE_USER) {
      let username = object.get('username')
      username = username ? username : `${object.get('first_name')} ${object.get('last_name')}`
      return (
        `<span class="text-primary">${username}</span>`
      )
    }
    return ''
  }

  handleClick = (event) => {
    event.preventDefault()

    // const { notification } = this.props
    // let url = null

    // if (notification.get('action_type') === NOTIFICATION_TYPE_AUCTION) {
    //   url = `/auctions/${notification.getIn(['subject', 'pk'], 0)}`
    // }

    // if (url) {
    //   // Do some actions here
    // }
  }

  render() {
    const { notification } = this.props
    let content = this.templates[notification.get('action')]
    content = content.replace('%s', this.objectRepresentation(notification.get('subject')))
    content = content.replace('%t', this.objectRepresentation(notification.get('target')))

    return (
      <DropdownItem onClick={this.handleClick}>
        <span dangerouslySetInnerHTML={{ __html: content }} />
      </DropdownItem>
    )
  }
}

export default AdminHeaderNotificationItem
