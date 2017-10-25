import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import './style.css'


class DonorCard extends PureComponent {

  static propTypes = {
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    const { id, image, title } = this.props

    return (
      <div className="card donor-card">
        <div className="image" style={{ backgroundImage: `url(${image})`}} />
        <div className="card-body">
          <h4 className="pull-left">{title}</h4>
          <Link
            to={`/donors/${id}`}
            className="btn btn-sm btn-outline-primary btn-round px-4 pull-right d-none d-sm-block"
          >
            Learn more
          </Link>
        </div>
      </div>
    )
  }
}

export default DonorCard
