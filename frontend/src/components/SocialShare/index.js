import React from 'react'
import { generateShareIcon, ShareButtons } from 'react-share'

const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')
const LinkedinIcon = generateShareIcon('linkedin')

const {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton
} = ShareButtons

const COMPONENT_CLASS = 'social-share'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const SocialShare = ({ title, url }) => (
  <div className={COMPONENT_CLASS}>
    <div className={bem('label')}>
      Share:
    </div>
    <FacebookShareButton
      url={url}
      quote={title}
      className={bem('button')}
    >
      <FacebookIcon size={32} round />
    </FacebookShareButton>
    <TwitterShareButton
      url={url}
      title={title}
      className={bem('button')}
    >
      <TwitterIcon size={32} round />
    </TwitterShareButton>

    <LinkedinShareButton
      url={url}
      title={title}
      windowWidth={750}
      windowHeight={600}
      className={bem('button')}
    >
      <LinkedinIcon size={32} round />
    </LinkedinShareButton>
  </div>
)

export default SocialShare
