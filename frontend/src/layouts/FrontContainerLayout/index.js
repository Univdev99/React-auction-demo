import React from 'react'
import PropTypes from 'prop-types'
import AppContainerLayout from '../AppContainerLayout'
import AppLayout1 from '../AppLayout1'
import Breadcrumb from 'components/Breadcrumb'


const FrontContainerLayout = ({ breadcrumbPath, children, subscribe, title }) => (
  <AppLayout1 subscribe={subscribe}>
    <AppContainerLayout>
      {breadcrumbPath && <Breadcrumb className="mb-5" path={breadcrumbPath} />}
      {title && <h3 className="mb-5">{title}</h3>}
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
