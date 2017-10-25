import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import AppContainerLayout from 'components/AppContainerLayout'
import Breadcrumb from 'components/Breadcrumb'
import DonorCard from 'components/DonorCard'
import AppLayout1 from 'pages/AppLayout1'
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
      <AppLayout1>
        <AppContainerLayout>
          <Breadcrumb className="mb-5" path={this.breadcrumbPath()} />

          <h3 className="mb-5">Donors</h3>

          <div className="row">
            {donorListPage.map(donor => (
              <div key={donor.get('pk')} className="col-lg-6 col-md-12 mb-3">
                <DonorCard
                  id={donor.get('pk')}
                  image={donor.getIn(['media', 0, 'medium', 'url'], '')}
                  title={donor.get('title')}
                />
              </div>
            ))}
          </div>
        </AppContainerLayout>
      </AppLayout1>
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
