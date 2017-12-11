import React from 'react'
import cx from 'classnames'
import { Col, Row } from 'reactstrap'

const COMPONENT_CLASS = 'image-grid'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const ImageGrid = ({ image1, image2, image3 }) => (
  <Row>
    <Col xs={12} md={8}>
      <div
        className={cx(bem('image'), bem('image--big'), 'gb mb-md-0')}
        style={{ backgroundImage: `url(${image1})` }}
      />
    </Col>
    <Col xs={12} md={4}>
      <div
        className={cx(bem('image'), 'gb')}
        style={{ backgroundImage: `url(${image2})` }}
      />
      <div
        className={bem('image')}
        style={{ backgroundImage: `url(${image3})` }}
      />
    </Col>
  </Row>
)

export default ImageGrid
