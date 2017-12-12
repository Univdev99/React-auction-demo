import React, { PureComponent } from 'react'
import { Col, Row } from 'reactstrap'

import ContactForm from 'components/ContactForm'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import IconListItem from 'components/IconListItem'
import IconBuilding from 'icons/IconBuilding'
import IconMail from 'icons/IconMail'
import IconPhone from 'icons/IconPhone'
import Section from 'components/Section'


class Support extends PureComponent {

  submitForm = (data) => {
    console.log(data)
  }

  render() {

    return (
      <FrontContainerLayout
        title="Support"
        subscribe
      >
        <Section>
          <Row>
            <Col xs={12} md={7}>
              <p>
                Don’t hesistate to contact us with any questions or suggestions, as we’re always
                glad to hear from you. We believe we all want to do good, but sometimes it’s hard
                to figure out how. That’s why we’ve made it our mission to do more good in the
                world with easy, meaningfulgiving . We’ve created a unique auction space full of
                collectibles, celebrity luxury items, and other valuable goods. Each day, we place
                them on auction for buyers around the world, with proceeds going to the giver’s
                organization of choice.
              </p>
            </Col>
            <Col xs={12} md={5}>
              <div mbResponsive className="pl-md-4">
                <IconListItem icon={IconPhone}>
                  (212) 243-3900 (9am-6pm EST)
                </IconListItem>
                <IconListItem icon={IconMail}>
                  <a href="mailto:info@yuma.com">info@yuma.com</a>
                </IconListItem>
                <IconListItem icon={IconBuilding}>
                  437 Fifth Avenue<br />
                  11th Floor<br />
                  New York, NY 10016
                </IconListItem>
              </div>
            </Col>
          </Row>
        </Section>
        <Section title="Contact Form">
          <ContactForm onSubmit={this.submitForm} />
        </Section>
      </FrontContainerLayout>
    )
  }
}

export default Support
