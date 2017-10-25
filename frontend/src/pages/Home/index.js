import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import CompanyCard from 'components/CompanyCard'
import HomeBanner from 'components/HomeBanner'
import AppLayout1 from 'pages/AppLayout1'
import { getDonorFrontList } from 'store/modules/donors'
import { authSelector, donorsSelector } from 'store/selectors'


class Home extends PureComponent {

  static propTypes = {
    auth: ImmutablePropTypes.map.isRequired,
    getDonorFrontList: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { donors, getDonorFrontList } = this.props
    if (!donors.get('donorFrontListLoaded')) {
      getDonorFrontList()
    }
  }

  render() {
    const { donors } = this.props
    const donorFrontList = donors.get('donorFrontList')

    return (
      <AppLayout1>
        <HomeBanner />

        <div className="container my-5">
          <div className="clearfix mb-4">
            <h3 className="pull-left">Companies</h3>
            <button className="pull-right btn btn-sm btn-outline-secondary">All companies</button>
          </div>

          <div className="row">
            {donorFrontList.map(donor => (
              <div key={donor.get('pk')} className="col-lg-6 col-md-12 mb-3">
                <CompanyCard
                  id={donor.get('pk')}
                  image={donor.getIn(['media', 0, 'medium', 'url'], '')}
                  title={donor.get('title')}
                />
              </div>
            ))}
          </div>
        </div>
      </AppLayout1>
    )
  }
}

const selector = createStructuredSelector({
  auth: authSelector,
  donors: donorsSelector,
})

const actions = {
  getDonorFrontList,
}

export default compose(
  connect(selector, actions)
)(Home)
