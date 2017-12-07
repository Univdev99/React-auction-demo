import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardText, CardTitle, Col, Row } from 'reactstrap'
import PropTypes from 'prop-types'

import CharitiesBlock from 'components/CharitiesBlock'
import InstagramLink from 'components/InstagramLink'


const COMPONENT_CLASS = 'donor-card'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

class DonorCard extends PureComponent {

  static propTypes = {
    donor: PropTypes.object
  }

  render() {
    const { donor } = this.props
    const linkTo = `/donors/${donor.get('pk')}`

    return (
      <Col lg={6} xs={12} className="gb">
        <Card className={COMPONENT_CLASS}>
          <div className={bem('image')} style={{ backgroundImage: `url(${donor.getIn(['media', 0, 'url'], '')})`}} />
          <CardBody>
            <Row className={bem('heading')}>
              <Col xs={12} md={8} lg={7} xl={8}>
                <CardTitle className="mb-0">
                  <Link to={linkTo}>{donor.get('title')}</Link>
                </CardTitle>
                <InstagramLink handle={donor.get('instagram_handle')} />
              </Col>
              <Col xs={12} md={4} lg={5} xl={4} className="text-right align-self-end">
                <Button color="primary" tag={Link} to={linkTo} className="d-none d-md-block">
                  See all auctions
                </Button>
              </Col>
            </Row>
            <CardText
              className={bem('description')}
              dangerouslySetInnerHTML={{ __html: donor.get('description') }}
              tag="div"
            />
            <CharitiesBlock charities={donor.get('charities')} forCard />
            <Button color="primary" block tag={Link} to={linkTo} className="d-md-none mt-3">
              See all auctions
            </Button>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default DonorCard
