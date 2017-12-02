import React from 'react'
import { Row } from 'reactstrap'

const ListWrapper = ({ children }) => (
  <Row className="list-wrapper">
    {children}
  </Row>
)

export default ListWrapper
