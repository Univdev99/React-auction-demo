import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb as BsBreadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom'


class Breadcrumb extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    path: PropTypes.array.isRequired,
  }

  render() {
    const { className, path } = this.props

    return (
      <nav aria-label="breadcrumb" className={className}>
        <BsBreadcrumb className="breadcrumb-top">
          {path.map((pathElement, index) => (
            pathElement.route ? (
              <BreadcrumbItem key={index}>
                <Link to={pathElement.route}>{pathElement.text}</Link>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem key={index} active>
                {pathElement.text}
              </BreadcrumbItem>
            )
          ))}
        </BsBreadcrumb>
      </nav>
    )
  }
}

export default Breadcrumb
