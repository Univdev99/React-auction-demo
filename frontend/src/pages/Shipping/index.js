import React from 'react'

import ContactTextLink from 'components/ContactTextLink'
import FrontContainerLayout from 'layouts/FrontContainerLayout'


const breadcrumbPath = [
  { route: '/', text: 'Home' },
  { text: 'Shipping' },
]

const Shipping = () => (
  <FrontContainerLayout
    breadcrumbPath={breadcrumbPath}
    title="Shipping"
    subscribe
  >
    <p>
      We ship to all US states and territories, as well as PO boxes and APO/FPO addresses. Most
      standard shipping orders placed by 5 p.m. EST will be processed the same business day, and
      will ship within one business day after your order is placed. Please note that some orders
      may take longer to process. All orders are subject to credit approval. Orders for express
      delivery may be placed Monday through Thursday before 3 p.m. EST. Express delivery orders
      placed between 3 p.m. Thursday and 3 p.m. Friday will arrive on Monday; those placed after
      3 p.m. Friday will arrive on Tuesday. We do not ship or deliver on Saturdays, Sundays or
      holidays.
    </p>

    <h4>Section Heading</h4>
    <p>
      Once you register as a User on the Site, the Site offers several ways for a Yuma User to
      acquire properties or experiences. The first way is by bidding through an online auction
      on the Site for Property and/or an Experience (the "Auction") that is offered by a charitable
      organization or third party donor (collectively, the "Seller") through Yuma. The second way
      is by submitting a request to Yuma under the Yuma Custom Experiences Program for a specific
      Property and/or an Experience. An "Experience" may include, but is not limited to, a celebrity
      meet and greet, dinner with a celebrity or other such experience. "Property" is tangible
      property, including without limitation artwork, apparel, food, wine, sports and music
      memorabilia. The term "Lot" refers to either an Experience or a Property.
    </p>
    <h4>One More Section</h4>
    <p>
      It may be necessary − by law, legal process, litigation, and/or requests from public and
      governmental authorities within or outside your country of residence − for Yuma to disclose
      your personal information. We may also disclose information about you if we determine that
      for purposes of national security, law enforcement, or other issues of public importance, 
      disclosure is necessary or appropriate.
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
  </FrontContainerLayout>
)

export default Shipping
