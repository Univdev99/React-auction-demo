import React from 'react'

import ContactTextLink from 'components/ContactTextLink'
import FrontContainerLayout from 'layouts/FrontContainerLayout'

const breadcrumbPath = [
  { route: '/', text: 'Home' },
  { text: 'Terms & Conditions' },
]

const TermsConditions = () => (
  <FrontContainerLayout
    breadcrumbPath={breadcrumbPath}
    title="Terms & Conditions"
    subscribe
  >
    <p>
      This website (the "Site") is brought to you by Yuma, LLC. d/b/a Yuma (“Yuma”). Your use of the
      Site is governed by these terms of use. Please read these terms carefully and do not use this
      Site if you do not agree with these terms of use. The services provided on the Site include
      auctions and the Custom Experiences and Do Good Programs (collectively, the "Custom Experiences"
        Program) for a variety of property and experiences. By using this Site and participating in
      these auctions and the Custom Experiences Program, YOU AGREE TO BE BOUND TO ANY PURCHASES YOU
      WIN AND YOU FURTHER AGREE TO BE BOUND BY THESE TERMS OF USE.
    </p>

    <h4>Operation of Site</h4>
    <p>
      Once you register as a User on the Site, the Site offers several ways for a Yuma User to acquire
      properties or experiences. The first way is by bidding through an online auction on the Site for
      Property and/or an Experience (the "Auction") that is offered by a charitable organization or
      third party donor (collectively, the "Seller") through Yuma. The second way is by submitting a
      request to Yuma under the Yuma Custom Experiences Program for a specific Property and/or an
      Experience. An "Experience" may include, but is not limited to, a celebrity meet and greet,
      dinner with a celebrity or other such experience. "Property" is tangible property, including
      without limitation artwork, apparel, food, wine, sports and music memorabilia. The term "Lot"
      refers to either an Experience or a Property.
    </p>
    <h4>One More Section</h4>
    <p>
      It may be necessary − by law, legal process, litigation, and/or requests from public and
      governmental authorities within or outside your country of residence − for Yuma to disclose
      your personal information. We may also disclose information about you if we determine that for
      purposes of national security, law enforcement, or other issues of public importance, disclosure
      is necessary or appropriate.
    </p>
    <p>
      We may also disclose information about you if we determine that disclosure is reasonably necessary
      to enforce our user agreement or protect our operations or users. Additionally, in the event of a
      reorganization, merger, or sale we may transfer any and all personal information we collect to the
      relevant third party. You will be notified via email and/or a prominent notice on our website, of
      any change in ownership, uses of your personal information, and choices you may have regarding your
      personal information.
    </p>
  
    <ContactTextLink />
  </FrontContainerLayout>
)

export default TermsConditions
