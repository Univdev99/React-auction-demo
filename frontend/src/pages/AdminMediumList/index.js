import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Pagination, PaginationItem, PaginationLink,
  Row, Col, Input,
} from 'reactstrap'
import moment from 'moment'

import AdminLayout from 'pages/AdminLayout'
import { MEDIUM_PAGE_SIZE } from 'config'
import {
  getMediumListPage,
} from 'store/modules/admin/media'
import {
  adminMediaSelector,
} from 'store/selectors'
import './style.css'


class AdminMediumList extends PureComponent {

  static propTypes = {
    adminMedia: ImmutablePropTypes.map.isRequired,
    getMediumListPage: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1,
    page: 1,
    typeFilter: '',
    dateFilter: '',
  }

  getPageNumbers = (page) => {
    const { adminMedia } = this.props
    const count = adminMedia.get('mediumCount')
    let pageCount = Math.max(Math.ceil(count / MEDIUM_PAGE_SIZE), 1)
    page = Math.max(1, Math.min(page, pageCount))

    const pages = []
    let i
    const start = Math.max(1, Math.min(pageCount - 4, page - 2))
    const end = Math.min(pageCount, Math.max(page + 2, 5))

    if (pageCount > 3 && start > 2) {
      pages.push('.')
    }

    for (i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < pageCount - 2) {
      pages.push('..')
    }

    if (pageCount > end) {
      pages.push(pageCount)
    }

    return pages
  }

  getPageCount = () => {
    const { adminMedia } = this.props
    const count = adminMedia.get('mediumCount')
    return Math.max(Math.ceil(count / MEDIUM_PAGE_SIZE), 1)
  }

  refreshPage = () => {
    this.setState({
      loadingStatus: 1
    })

    const { page, typeFilter, dateFilter } = this.state
    this.props.getMediumListPage({
      page,
      type: typeFilter,
      date: dateFilter,
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
  }

  getPage = (page) => {
    this.setState({
      page
    }, this.refreshPage)
  }

  getMediumDates = () => {
    const mediumDates = []
    const today = new Date()
    const startDate = new Date(today.getFullYear() - 2, 0, 1, 0, 0)

    while (startDate < today) {
      const m = moment(startDate)
      mediumDates.push({
        key: m.format('Y/MM'),
        value: m.format('MMM Y')
      })
      startDate.setMonth(startDate.getMonth() + 1)
    }

    return mediumDates
  }

  handleChangeTypeFilter = (e) => {
    this.setState({
      typeFilter: e.target.value,
      page: 1,
    }, this.refreshPage)
  }

  handleChangeDateFilter = (e) => {
    this.setState({
      dateFilter: e.target.value,
      page: 1,
    }, this.refreshPage)
  }

  handleClickPageLink = (page, event) => {
    if (event) {
      event.preventDefault()
    }

    this.getPage(page)
  }

  componentWillMount() {
    this.getPage(1)
  }

  render() {
    const { adminMedia } = this.props
    const mediumListPage = adminMedia.get('mediumListPage')
    const currentPage = adminMedia.get('mediumPageNumber')
    const { loadingStatus, typeFilter, dateFilter } = this.state

    return (
      <AdminLayout>
        <h2 className="mb-5">Media Library</h2>

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        <Row className="mb-4">
          <Col lg="3" md="4" sm="6" xs="12" className="mb-4">
            <Input type="select" value={typeFilter} onChange={this.handleChangeTypeFilter}>
              <option value="">All media items</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audios</option>
            </Input>
          </Col>
          <Col lg="3" md="4" sm="6" xs="12" className="mb-4">
            <Input type="select" value={dateFilter} onChange={this.handleChangeDateFilter}>
              <option value="">All dates</option>
              {this.getMediumDates().map(dateObj => (
                <option key={dateObj.key} value={dateObj.key}>{dateObj.value}</option>
              ))}
            </Input>
          </Col>
        </Row>

        {loadingStatus !== -1 && <Row>
          {mediumListPage.map(medium => (
            <Col key={medium.get('pk')} className="mb-4" xl="2" lg="3" md="4" sm="6" xs="12">
              <div className="medium-wrapper">
                {medium.get('type') === 'image' && <img
                  className="img-fluid" src={medium.get('url')} alt="Medium" />}
                {medium.get('type') === 'video' && <div className="video-wrapper">
                  <video src={medium.get('url')} controls />
                </div>}
                {medium.get('type') === 'audio' && <div className="video-wrapper">
                  <audio src={medium.get('url')} controls />
                </div>}
              </div>
            </Col>
          ))}
        </Row>}

        {loadingStatus !== -1 && <div className="mt-5">
          <Pagination>
            <PaginationItem>
              <PaginationLink previous onClick={this.handleClickPageLink.bind(this, 1)} />
            </PaginationItem>
            {this.getPageNumbers(currentPage).map(pageNumber => {
              const ellipsis = (pageNumber === '.' || pageNumber === '..')
              return (
                <PaginationItem key={pageNumber} disabled={ellipsis}>
                  <PaginationLink href="#" onClick={ellipsis ? null : this.handleClickPageLink.bind(this, pageNumber)}>
                    {
                      ellipsis ?
                      <span dangerouslySetInnerHTML={{ __html: '&#8230' }} /> :
                      pageNumber
                    }
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            <PaginationItem>
              <PaginationLink
                next
                href="#"
                onClick={this.handleClickPageLink.bind(this, this.getPageCount())}
              />
            </PaginationItem>
          </Pagination>
        </div>}
      </AdminLayout>
    )
  }
}

const selector = createStructuredSelector({
  adminMedia: adminMediaSelector,
})

const actions = {
  getMediumListPage,
}

export default compose(
  connect(selector, actions)
)(AdminMediumList)
