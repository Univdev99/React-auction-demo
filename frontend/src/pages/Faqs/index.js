import React, { PureComponent } from 'react'

import AppContainerLayout from 'components/AppContainerLayout'
import Breadcrumb from 'components/Breadcrumb'
import AppLayout1 from 'pages/AppLayout1'
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
      <AppLayout1>
        <AppContainerLayout>
          <Breadcrumb className="mb-5" path={this.breadcrumbPath()} />

          <h3 className="mb-5">FAQs</h3>

          {faqList.map((item, index) => (
            <FaqItem {...item} key={index} />
          ))}
        </AppContainerLayout>
      </AppLayout1>
    )
  }
}
