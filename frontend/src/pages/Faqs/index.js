import React, { PureComponent } from 'react'

import Breadcrumb from 'components/Breadcrumb'
import FaqItem from './FaqItem'
import faqList from './faqList'

export default class Faqs extends PureComponent {
  breadcrumbPath() {
    return [
      { route: '/', text: 'Home' },
      { text: 'FAQs' },
    ]
  }

  render() {
    return (
      <div>
        <Breadcrumb className="mb-5" path={this.breadcrumbPath()} />

        <h3 className="mb-5">FAQs</h3>

        {faqList.map((item, index) => (
          <FaqItem {...item} key={index} />
        ))}
      </div>
    )
  }
}
