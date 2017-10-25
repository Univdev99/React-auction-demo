import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'


class Breadcrumb extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    path: PropTypes.array.isRequired,
  }

  render() {
    const { className, path } = this.props

    return (
      <nav aria-label="breadcrumb">
        <ol className={classnames('breadcrumb p-0 bg-transparent', className)}>
          {path.map((pathElement, index) => (
            pathElement.route ?
            <li key={index} className="breadcrumb-item">
              <Link to={pathElement.route}>{pathElement.text}</Link>
            </li>
            :
            <li key={index} className="breadcrumb-item active" aria-current="page">{pathElement.text}</li>
          ))}
        </ol>
      </nav>
    )
  }
}

export default Breadcrumb
