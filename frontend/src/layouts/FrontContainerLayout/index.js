import React from 'react'
import PropTypes from 'prop-types'

import AppContainerLayout from '../AppContainerLayout'
import AppLayout1 from '../AppLayout1'
import SectionTitle from 'components/SectionTitle'


const FrontContainerLayout = ({ breadcrumbPath, children, subscribe, title }) => (
  <AppLayout1 subscribe={subscribe}>
    <AppContainerLayout>
      {title && <div className="front-container-layout__header">
        <SectionTitle>{title}</SectionTitle>
      </div>}
      {children}
    </AppContainerLayout>
  </AppLayout1>
)

FrontContainerLayout.propTypes = {
  breadcrumbPath: PropTypes.array,
  children: PropTypes.node.isRequired,
  subscribe: PropTypes.bool,
  title: PropTypes.string
}

export default FrontContainerLayout
