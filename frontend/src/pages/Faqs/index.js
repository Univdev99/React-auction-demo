import React, { PureComponent } from 'react'

import FaqItem from './FaqItem'
import faqList from './faqList'
import FrontContainerLayout from 'layouts/FrontContainerLayout'

export default class Faqs extends PureComponent {
  breadcrumbPath() {
    return [
      { route: '/', text: 'Home' },
      { text: 'FAQs' },
    ]
  }

  render() {
    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath()}
        title="FAQs"
        subscribe
      >
        {faqList.map((item, index) => (
          <FaqItem {...item} key={index} />
        ))}
      </FrontContainerLayout>
    )
  }
}
