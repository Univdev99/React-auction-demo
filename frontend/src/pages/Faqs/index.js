import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

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
        breadcrumbPath={this.breadcrumbPath()}
        title="FAQs"
        subscribe
      >
        {faqList.map((item, index) => (
          <FaqItem {...item} key={index} />
        ))}
        <h4 className="text-center mt-50 mt-md-40 pt-md-40">
          Didn’t find the answer? <Link to="/support">Contact us</Link>
        </h4>
      </FrontContainerLayout>
    )
  }
}
