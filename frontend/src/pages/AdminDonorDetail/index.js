import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import Spinner from 'components/Spinner'
import Uploader from 'components/Uploader'
import DonorForm from 'components/DonorForm'
import AdminLayout from 'pages/AdminLayout'
import { getCharityList } from 'store/modules/admin/charities'
import {
  getDonorDetail,
  updateDonorDetail,
  uploadDonorLogo,
  uploadDonorVideo,
} from 'store/modules/admin/donors'
import { adminCharitiesSelector, adminDonorsSelector } from 'store/selectors'


class AdminDonorDetail extends PureComponent {

  static propTypes = {
    adminCharities: ImmutablePropTypes.map.isRequired,
    adminDonors: ImmutablePropTypes.map.isRequired,
    getCharityList: PropTypes.func.isRequired,
    getDonorDetail: PropTypes.func.isRequired,
    updateDonorDetail: PropTypes.func.isRequired,
    uploadDonorLogo: PropTypes.func.isRequired,
    uploadDonorVideo: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    loadingStatus: 1,
    updatingStatus: 0,
  }

  handleSubmit = (data) => {
    this.setState({
      updatingStatus: 1
    })

    this.props.updateDonorDetail({
      id: this.props.match.params.id,
      data,
      success: () => this.setState({
        updatingStatus: 10
      }),
      fail: () => this.setState({
        updatingStatus: -1
      }),
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/donors'
  })

  componentWillMount() {
    const { adminCharities } = this.props
    const charityListLoaded = adminCharities.get('charityListLoaded')
    if (!charityListLoaded) {
      this.props.getCharityList()
    }

    this.setState({
      loadingStatus: 1
    })

    this.props.getDonorDetail({
      id: this.props.match.params.id,
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  render() {
    const { adminCharities } = this.props
    const charityListLoaded = adminCharities.get('charityListLoaded')
    const charityList = adminCharities.get('charityList')
    const { adminDonors } = this.props
    const donorDetail = adminDonors.get('donorDetail')
    const { loadingStatus, updatingStatus } = this.state

    if (loadingStatus === -1) {
      return (
        <AdminLayout>
          <h2>Donor not found</h2>
        </AdminLayout>
      )
    }

    return (
      <AdminLayout>
        <div>
          <div className="clearfix">
            <h3 className="mb-5 pull-left">Edit Donor</h3>
            {
              donorDetail ?
              <Link
                className="btn btn-primary pull-right"
                to={`/admin/donors/${donorDetail.get('pk')}/products`}
              >
                Products from this donor
              </Link>
              :
              <button className="btn btn-primary pull-right" disabled>
                Products from this donor
              </button>
            }
          </div>

          {(loadingStatus === 1 || !donorDetail || !charityListLoaded) && <Spinner />}

          {loadingStatus === 10 && donorDetail && charityListLoaded && <div>
            <div className="mb-4">
              <label>Upload logo here:</label>
              <Uploader
                uploadAction={this.props.uploadDonorLogo}
                uploadActionParams={{ id: this.props.match.params.id }}
                defaultImageURL={donorDetail.get('logo')}
              />
            </div>

            <div className="mb-4">
              <label>Upload video here:</label>
              <Uploader
                uploadAction={this.props.uploadDonorVideo}
                uploadActionParams={{ id: this.props.match.params.id }}
                defaultImageURL={donorDetail.get('video')}
              />
            </div>

            {updatingStatus === -1 && <div className="mb-2 text-danger">
              Failed to update donor
            </div>}
            
            <DonorForm
              initialValues={donorDetail.delete('pk')}
              charityList={charityList}
              disabled={updatingStatus === 1}
              onSubmit={this.handleSubmit}
              onBack={this.handleBack}
            />
          </div>}
        </div>
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  adminCharities: adminCharitiesSelector,
  adminDonors: adminDonorsSelector,
})

const actions = {
  getCharityList,
  getDonorDetail,
  updateDonorDetail,
  uploadDonorLogo,
  uploadDonorVideo,
}

export default compose(
  connect(selector, actions)
)(AdminDonorDetail)
