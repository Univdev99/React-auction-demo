import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import AppContainerLayout from 'components/AppContainerLayout'
import AppLayout1 from 'pages/AppLayout1'
import DonateBar from 'components/DonateBar'
import DonorCard from 'components/DonorCard'
import HomeBanner from 'components/HomeBanner'
import { getDonorFrontList } from 'store/modules/donors'
import { donorsSelector } from 'store/selectors'


class Home extends PureComponent {

  static propTypes = {
    donors: ImmutablePropTypes.map.isRequired,
    getDonorFrontList: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { donors, getDonorFrontList } = this.props
    if (!donors.get('donorListLoaded')) {
      getDonorFrontList()
    }
  }

  render() {
    const { donors } = this.props
    const donorFrontList = donors.get('donorFrontList')

    return (
      <AppLayout1>
        <HomeBanner />

        <AppContainerLayout>
          <div className="clearfix mb-5">
            <h3 className="pull-left">Donors</h3>
            <Link to="/donors" className="pull-right btn btn-sm btn-outline-secondary">All donors</Link>
          </div>

          <div className="row">
            {donorFrontList.map(donor => (
              <div key={donor.get('pk')} className="col-lg-6 col-md-12 mb-3">
                <DonorCard
                  id={donor.get('pk')}
                  image={donor.getIn(['media', 0, 'url'], '')}
                  title={donor.get('title')}
                />
              </div>
            ))}
          </div>
        </AppContainerLayout>
        <DonateBar />
      </AppLayout1>
    )
  }
}

const selector = createStructuredSelector({
  donors: donorsSelector,
})

const actions = {
  getDonorFrontList,
}

export default compose(
  connect(selector, actions)
)(Home)
