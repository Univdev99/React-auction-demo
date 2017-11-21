import React, { PureComponent } from 'react'
import { Col, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import DonorCard from 'components/DonorCard'
import FrontContainerLayout from 'layouts/FrontContainerLayout'
import { getDonorListPage } from 'store/modules/donors'
import { donorsSelector } from 'store/selectors'


class Donors extends PureComponent {

  static propTypes = {
    donors: ImmutablePropTypes.map.isRequired,
    getDonorListPage: PropTypes.func.isRequired,
  }

  breadcrumbPath() {
    return [
      { route: '/', text: 'Home' },
      { text: 'Donors' },
    ]
  }

  componentWillMount() {
    const { donors, getDonorListPage } = this.props
    if (!donors.get('donorListPageLoaded')) {
      getDonorListPage()
    }
  }

  render() {
    const { donors } = this.props
    const donorListPage = donors.get('donorListPage')

    return (
      <FrontContainerLayout
        breadcrumbPath={this.breadcrumbPath()}
        title="Donors"
        subscribe
      >  
        <Row>
          {donorListPage.map(donor => (
            <Col key={donor.get('pk')} xs={12} lg={6} className="mb-3">
              <DonorCard
                id={donor.get('pk')}
                image={donor.getIn(['media', 0, 'url'], '')}
                title={donor.get('title')}
              />
            </Col>
          ))}
        </Row>
      </FrontContainerLayout>
    )
  }
}

const selector = createStructuredSelector({
  donors: donorsSelector,
})

const actions = {
  getDonorListPage,
}

export default compose(
  connect(selector, actions)
)(Donors)
