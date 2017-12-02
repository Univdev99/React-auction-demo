import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardText, CardTitle, Col, Row } from 'reactstrap'
import PropTypes from 'prop-types'


const COMPONENT_CLASS = 'donor-card'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class DonorCard extends PureComponent {

  static propTypes = {
    description: PropTypes.string,
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    const { id, image, title, description } = this.props

    return (
      <Col lg={6} xs={12} className="gb">
        <Card className={COMPONENT_CLASS}>
          <div className={bem('image')} style={{ backgroundImage: `url(${image})`}} />
          <CardBody>
            <Row className="align-items-center mb-3">
              <Col xs={12} md={8} lg={7} xl={8}>
                <CardTitle className="mb-0">{title}</CardTitle>
              </Col>
              <Col xs={12} md={4} lg={5} xl={4} className="text-right">
                <Button color="primary" tag={Link} to={`/donors/${id}`} className="d-none d-md-block">
                  Learn more
                </Button>
              </Col>
            </Row>
            <CardText className={bem('description')}>{description}</CardText>
            <Button color="primary" block tag={Link} to={`/donors/${id}`} className="d-md-none mt-3">
              Learn more
            </Button>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default DonorCard
