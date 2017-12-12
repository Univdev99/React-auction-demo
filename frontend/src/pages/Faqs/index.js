import React, { PureComponent } from 'react'

import ContactTextLink from 'components/ContactTextLink'
import FaqItem from './FaqItem'
import faqList from './faqList'
import FrontContainerLayout from 'layouts/FrontContainerLayout'


export default class Faqs extends PureComponent {
  breadcrumbPath() {
    return [
      { route: '/', text: 'Home' },
      { text: 'FAQ' },
    ]
  }

  render() {
    return (
      <FrontContainerLayout
        title="FAQs"
        subscribe
      >
        {faqList.map((item, index) => (
          <FaqItem {...item} key={index} />
        ))}
        <ContactTextLink text="Didn’t find the answer?" />
      </FrontContainerLayout>
    )
  }
}
