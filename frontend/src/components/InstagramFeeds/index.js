import React, { PureComponent } from 'react'
import Instafeed from 'instafeed.js/instafeed.js'
import PropTypes from 'prop-types'

import ArrowLink from 'components/ArrowLink'
import instagramLogo from 'images/instagram-logo.svg'

const COMPONENT_CLASS = 'instagram-feeds'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`
const clientId = process.env.REACT_APP_INSTAGRAM_CLIENT_ID
const userId = process.env.REACT_APP_INSTAGRAM_USER_ID
const accessToken = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN

class InstagramFeeds extends PureComponent {

  render() {
    const instafeed = new Instafeed({
      target: this.props.target || 'instafeed',
      get: 'user',
      userId,
      clientId,
      accessToken,
      resolution: this.props.resolution || 'standard_resolution',
      sortBy: this.props.sortBy || 'most-recent',
      limit: this.props.limit || 4,
      filter: (item) => (
        item.caption && item.caption.text ? (
          item.short_caption = item.caption.text,
          item.short_caption.length > 160 &&
            ( item.short_caption = item.caption.text.slice(0,150) + `...` ),
          item.short_caption = item.short_caption.replace(
            /(#[a-zA-Z0-9_-]+)/g,
            `<strong class='instafeed__item__hashtag'>$1</strong>`)
        ) : item.short_caption='',!0 // eslint-disable-line no-sequences
      ),
      template: this.props.template || `
        <div class="${bem('item')}">
          <a href='{{link}}' target='_blank'>
            <img class="${bem('img')}" src='{{image}}' />
          </a>
        </div>`
    });
    instafeed.run();

    return (
      <div className={COMPONENT_CLASS}>
        <div className={bem('link-wrap')}>
          <img src={instagramLogo} className={bem('link-bg')} alt="Instagram" />
          <ArrowLink
            to="https://instagram.com"
            text="Checkout Instagram"
            className={bem('link')}
            target="_blank"
          />
        </div>
        <div id="instafeed" className={bem('content')} />
      </div>
    )
  }
}

InstagramFeeds.propTypes = {
  clientId: PropTypes.string,
  target: PropTypes.string,
  resolution: PropTypes.string,
  limit: PropTypes.string,
  template: PropTypes.string
}

export default InstagramFeeds
