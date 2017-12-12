import React from 'react'
import PropTypes from 'prop-types'

import AppContainerLayout from '../AppContainerLayout'
import AppLayout1 from '../AppLayout1'
import Breadcrumb from 'components/Breadcrumb'
import SectionTitle from 'components/SectionTitle'


const FrontContainerLayout = ({ breadcrumbPath, children, className, subscribe, title }) => (
  <AppLayout1 className={className} subscribe={subscribe}>
    <AppContainerLayout>
      {breadcrumbPath && <Breadcrumb path={breadcrumbPath} />}
      {title && <div className="front-container-layout__header">
        <SectionTitle noMargin>{title}</SectionTitle>
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
