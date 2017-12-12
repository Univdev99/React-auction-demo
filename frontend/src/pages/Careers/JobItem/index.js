import React from 'react'
import cx from 'classnames'
import { Button, Card, CardText, CardTitle, Col, Row } from 'reactstrap'
import { Link } from 'react-router-dom'

const COMPONENT_CLASS = 'job-item'

const JobItem = ({ job }) =>  (
  <Card className={cx(COMPONENT_CLASS, 'gb')}>
    <Row>
      <Col xs={12} md={9} className="align-self-md-center gb mb-md-0">
        <CardTitle>{job.get('title')}</CardTitle>
        {job.get('location') && <CardText>{job.get('location')}</CardText>}
      </Col>
      <Col xs={12} md={3} className="align-self-md-center">
        <Button block color="primary" tag={Link} to={`/jobs/${job.get('pk')}`}>
          Apply
        </Button>
      </Col>
    </Row>
  </Card>
)

export default JobItem
