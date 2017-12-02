import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import RichTextEditor from 'react-rte'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'

import DonorForm from 'components/DonorForm'
import { formSubmit } from 'utils/form'
import SectionTitle from 'components/SectionTitle'
import SortableMediaList from 'components/SortableMediaList'
import Spinner from 'components/Spinner'
import Uploader from 'components/Uploader'
import { getCharityList } from 'store/modules/admin/charities'
import {
  getDonorDetail,
  updateDonorDetail,
  uploadDonorMedium,
  deleteDonorMedium,
  reorderDonorMedia,
} from 'store/modules/admin/donors'
import { adminCharitiesSelector, adminDonorsSelector } from 'store/selectors'


class AdminDonorDetail extends PureComponent {

  static propTypes = {
    adminCharities: ImmutablePropTypes.map.isRequired,
    adminDonors: ImmutablePropTypes.map.isRequired,
    getCharityList: PropTypes.func.isRequired,
    getDonorDetail: PropTypes.func.isRequired,
    updateDonorDetail: PropTypes.func.isRequired,
    uploadDonorMedium: PropTypes.func.isRequired,
    deleteDonorMedium: PropTypes.func.isRequired,
    reorderDonorMedia: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }

  state = {
    loadingStatus: 1,
  }

  handleSubmit = (data) => {
    const { match, updateDonorDetail } = this.props
    const formData = data.set(
      'description',
      data.get('description').toString('html')
    )

    return formSubmit(updateDonorDetail, {
      id: match.params.id,
      data: formData,
      success: this.handleBack
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/donors'
  })

  handleDeleteDonorMedium = (dmId, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to delete this medium?')) {
      return
    }

    this.props.deleteDonorMedium({
      id: this.props.match.params.id,
      dmId,
    })
  }

  getMedia = () => {
    const { adminDonors } = this.props
    const reorderedTemporaryDonorMedia = adminDonors.get('reorderedTemporaryDonorMedia')
    if (reorderedTemporaryDonorMedia) {
      return reorderedTemporaryDonorMedia
    }
    return adminDonors.getIn(['donorDetail', 'media'])
  }

  handleDragEnd = (result) => {
    const { adminDonors } = this.props
    const donorDetail = adminDonors.get('donorDetail')
    const media = donorDetail.get('media')
    const draggedMedium = media.get(result.source.index)
    const newMedia = media.delete(result.source.index)
      .insert(result.destination.index, draggedMedium)

    this.props.reorderDonorMedia({
      id: this.props.match.params.id,
      newMedia,
      data: {
        media_order: newMedia.map(medium => medium.get('pk')).toJS()
      }
    })
  }

  renderMediaDropzone = () => {
    const donorMedia = this.getMedia()

    return (
      <div className="form-group">
        <label className="mb-4">Add, remove or change order of images, audio and video:</label>
        <SortableMediaList
          media={donorMedia}
          onDragEnd={this.handleDragEnd}
          onDelete={this.handleDeleteDonorMedium}
        />

        <div className="mt-3">
          <Uploader
            uploadAction={this.props.uploadDonorMedium}
            uploadActionParams={{ id: this.props.match.params.id }}
          />
        </div>
      </div>
    )
  }

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
    const { loadingStatus } = this.state

    if (loadingStatus === -1) {
      return (
        <div>
          <SectionTitle>Donor not found</SectionTitle>
        </div>
      )
    }

    let _donorDetail = null
    if (donorDetail) {
      _donorDetail = donorDetail.delete('pk')
      _donorDetail = _donorDetail.set(
        'description',
        RichTextEditor.createValueFromString(_donorDetail.get('description'), 'html')
      )
    } else {
      _donorDetail = Immutable.Map({
        description: RichTextEditor.createEmptyValue()
      })
    }

    return (
      <div>
        <div>
          <div className="clearfix">
            <SectionTitle className="mb-5 pull-left">Edit Donor</SectionTitle>
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

          {loadingStatus === 10 && donorDetail && charityListLoaded &&
            <DonorForm
              initialValues={_donorDetail}
              charityList={charityList}
              renderMediaDropzone={this.renderMediaDropzone}
              onSubmit={this.handleSubmit}
              onBack={this.handleBack}
            />
          }
        </div>
      </div>
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
  uploadDonorMedium,
  deleteDonorMedium,
  reorderDonorMedia,
}

export default compose(
  connect(selector, actions)
)(AdminDonorDetail)
