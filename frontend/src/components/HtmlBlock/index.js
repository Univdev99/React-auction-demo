import React from 'react'

const HtmlBlock = ({ html }) => (
  <div
    className="html-block"
    dangerouslySetInnerHTML={{ __html: html }}
  />
)

export default HtmlBlock
