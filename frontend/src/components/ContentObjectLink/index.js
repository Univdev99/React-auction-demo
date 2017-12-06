import React, { PureComponent } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import {
  CONTENT_TYPE_AUCTION,
  CONTENT_TYPE_USER,
} from 'config'


class ContentObjectLink extends PureComponent {

  static propTypes = {
    contentObject: ImmutablePropTypes.map,
  }

  objectUrl() {
    const { contentObject } = this.props
    const pk = contentObject.get('pk')
    const contentType = contentObject.get('content_type')
    if (contentType === CONTENT_TYPE_USER) {
      return `/admin/users/${pk}`
    } else if (contentType === CONTENT_TYPE_AUCTION) {
      return `/admin/auctions/${pk}`
    }
    return null
  }

  objectTitle() {
    const { contentObject } = this.props
    const contentType = contentObject.get('content_type')
    if (contentType === CONTENT_TYPE_USER) {
      return contentObject.get('email')
    } else if (contentType === CONTENT_TYPE_AUCTION) {
      return contentObject.get('title')
    }
    return ' - '
  }

  render() {
    const { contentObject } = this.props

    if (!contentObject) {
      return <span>{' - '}</span>
    }

    const url = this.objectUrl()
    const title = this.objectTitle()

    if (url) {
      return <Link to={url}>{title}</Link>
    } else {
      return <span>{title}</span>
    }
  }
}

export default ContentObjectLink
