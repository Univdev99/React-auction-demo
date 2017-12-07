import React from 'react'

const getLink = (handle) =>
  `https://www.instagram.com/${handle}`

export const InstagramLink = ({ handle }) => handle ? (
  <a href={getLink(handle)} target="_blank" className="instagram-link">
    @{handle}
  </a>
) : false

export default InstagramLink
