import React, { PureComponent } from 'react'
import { Card, CardImg, Col, Row } from 'reactstrap'

import AppContainerLayout from 'layouts/AppContainerLayout'
import AppLayout1 from 'layouts/AppLayout1'
import Breadcrumb from 'components/Breadcrumb'
import IconListItem from 'components/IconListItem'
import SectionTitle from 'components/SectionTitle'
import SubscribeBar from 'components/SubscribeBar'

import placeholderImg from 'images/mission-placeholder.jpg'


const breadcrumbPath = [
  { route: '/', text: 'Home' },
  { text: 'Mission' },
]

class Mission extends PureComponent {
  render() {
    return (
      <AppLayout1>
        <AppContainerLayout>
          <Breadcrumb className="mb-5" path={breadcrumbPath} />

          <SectionTitle className="mb-5">Mission</SectionTitle>
          <Row className="mb-5">
            <Col xs={12} md={6}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut nibh dictum, auctor libero ac,
                varius sem. Aenean in augue sed enim pulvinar ultricies eget at nibh. Sed ac iaculis lorem. Donec
                faucibus sodales risus, ac scelerisque urna tristique at. Etiam non nulla molestie mi pellentesque
                rutrum. Fusce sodales tellus sit amet facilisis dictum. Sed sagittis vel dui condimentum dictum.
                Cras ut purus in ligula fermentum convallis. Praesent non dolor imperdiet, rutrum mi in, rhoncus
                neque. Maecenas sed gravida turpis. Proin commodo sem in arcu viverra lobortis. Morbi pulvinar at
                ante sed vestibulum. Sed molestie mi nec odio pharetra finibus non non est. Vivamus cursus velit
                leo, vel malesuada quam aliquam et.
              </p>
            </Col>
            <Col xs={12} md={6}>
              <IconListItem icon="fa-file">
                Etiam non nulla molestie mi pellentesque rutrum. Fusce sodales tellus sit amet facilisis dictum.
                Sed sagittis vel dui condimentum dictum.
              </IconListItem>
              <IconListItem icon="fa-file">
                Cras ut purus in ligula fermentum convallis. Praesent non dolor imperdiet, rutrum mi in, rhoncus
                neque. Maecenas sed gravida turpis. Proin commodo sem in arcu viverra lobortis.
              </IconListItem>
              <IconListItem icon="fa-file">
                ESed molestie mi nec odio pharetra finibus non non est. Vivamus cursus velit leo, vel malesuada
                quam aliquam et.
              </IconListItem>
            </Col>
          </Row>
        </AppContainerLayout>
        <SubscribeBar />
        <AppContainerLayout>
          <SectionTitle className="mt-5 mb-5 text-center">Mentioned In</SectionTitle>
          <Row>
            {[...Array(12).keys()].map((item, index) => (
              <Col xs={6} sm={4} md={3} lg={2} key={index} className="mb-4">
                <Card>
                  <CardImg top width="100%" src={placeholderImg} alt="" />
                </Card>
              </Col>
            ))}
          </Row>
        </AppContainerLayout>
      </AppLayout1>
    )
  }
}

export default Mission
