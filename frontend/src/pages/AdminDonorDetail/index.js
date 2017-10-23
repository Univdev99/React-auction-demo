import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import Spinner from 'components/Spinner'
import Uploader from 'components/Uploader'
import DonorForm from 'components/DonorForm'
import AdminLayout from 'pages/AdminLayout'
import { getCharityList } from 'store/modules/admin/charities'
import {
  getDonorDetail,
  updateDonorDetail,
  uploadDonorMedium,
  deleteDonorMedium,
  reorderDonorMedia,
} from 'store/modules/admin/donors'
import { adminCharitiesSelector, adminDonorsSelector } from 'store/selectors'
import './style.css'


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

  handleDeleteDonorMedium = (dmId, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to delete this medium?')) {
      return;
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

  getDeleteLinkStyle = (isDragging) => ({
    display: isDragging ? 'none' : 'block'
  })

  getItemStyle = (draggableStyle, isDragging) => ({
    userSelect: 'none',
    ...draggableStyle,
  })

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
    const donorMedia = this.getMedia()

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

            <div className="mt-5">
              <h5 className="mb-4">Donor images and videos:</h5>
              <DragDropContext onDragEnd={this.handleDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                  {(provided, snapshotGlobal) => (
                    <div ref={provided.innerRef}>
                      {donorMedia.map(medium => (
                        <Draggable key={medium.get('pk')} draggableId={medium.get('pk')}>
                          {(provided, snapshot) => (
                            <div className="donor-medium mr-3 mb-3">
                              <a
                                href="/"
                                className="btn-donor-medium-delete"
                                style={this.getDeleteLinkStyle(snapshotGlobal.isDragging)}
                                onClick={this.handleDeleteDonorMedium.bind(this, medium.get('pk'))}
                              >
                                <i className="fa fa-times"></i>
                              </a>
                              <div
                                ref={provided.innerRef}
                                style={this.getItemStyle(provided.draggableStyle, snapshot.isDragging)}
                                {...provided.dragHandleProps}
                              >
                                {
                                  medium.getIn(['medium', 'type']) === 'video' ?
                                  <video className="img-fluid" src={medium.getIn(['medium', 'url'])} controls />
                                  :
                                  <img className="img-fluid" src={medium.getIn(['medium', 'url'])} alt="Donor Medium" />
                                }
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="mt-4">
                <label>Upload new image or video:</label>
                <Uploader
                  uploadAction={this.props.uploadDonorMedium}
                  uploadActionParams={{ id: this.props.match.params.id }}
                />
              </div>
            </div>
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
  uploadDonorMedium,
  deleteDonorMedium,
  reorderDonorMedia,
}

export default compose(
  connect(selector, actions)
)(AdminDonorDetail)
