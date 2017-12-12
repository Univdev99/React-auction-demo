import React from 'react'

import ContactTextLink from 'components/ContactTextLink'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import Section from 'components/Section'


const PrivacyPolicy = () => (
  <FrontContainerLayout
    title="Privacy Policy"
    subscribe
  >
    <Section className="page-content">
      <h5>Effective Date: Feb 18, 2017</h5>
      <p>
        Your privacy is extremely important to Yuma. We have developed a Privacy Policy
        that covers how we collect, use, disclose, transfer, and store your information
        on our website. Please take a moment to familiarize yourself with our privacy
        practices and if you have any questions please direct them to{' '}
        <a href="mailto:privacy@yuma.com">privacy@yuma.com</a>
      </p>
      <h4>Disclosure to Third Parties</h4>
      <p>
        At times Yuma may make certain personal information available to strategic partners
        that work with Yuma to provide products and services, or that help Yuma market to
        customers. Yuma shares personal information with companies who provide services such
        as information processing, shipping, fulfilling customer orders, delivering products
        to you, managing and enhancing customer data, providing customer service, assessing
        your interest in our products and services, and conducting customer research or
        satisfaction surveys. These companies are obligated to protect your information and
        may be located wherever Yuma operates. We will share your personal information with
        third parties only in the ways that are described in this privacy statement. We do
        not sell your personal information to third parties.
      </p>
      <h4>Others</h4>
      <p>
        It may be necessary − by law, legal process, litigation, and/or requests from public
        and governmental authorities within or outside your country of residence − for Yuma
        to disclose your personal information. We may also disclose information about you if
        we determine that for purposes of national security, law enforcement, or other issues
        of public importance, disclosure is necessary or appropriate.
      </p>
      <p>
        We may also disclose information about you if we determine that disclosure is reasonably
        necessary to enforce our user agreement or protect our operations or users. Additionally,
        in the event of a reorganization, merger, or sale we may transfer any and all personal
        information we collect to the relevant third party. You will be notified via email and/or
        a prominent notice on our website, of any change in ownership, uses of your personal
        information, and choices you may have regarding your personal information.
      </p>
      <ContactTextLink />
    </Section>

  </FrontContainerLayout>
)

export default PrivacyPolicy
