import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

import AdminLayout from 'pages/AdminLayout'
import { MEDIUM_PAGE_SIZE } from 'config'
import {
  getMediumListPage,
} from 'store/modules/admin/media'
import {
  adminMediaSelector,
} from 'store/selectors'


class AdminMediumList extends PureComponent {

  static propTypes = {
    adminMedia: ImmutablePropTypes.map.isRequired,
    getMediumListPage: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1
  }

  getPageNumbers = (page) => {
    const { adminMedia } = this.props
    const count = adminMedia.get('mediumCount')
    let pageCount = Math.max(Math.ceil(count / MEDIUM_PAGE_SIZE), 1)
    page = Math.max(1, Math.min(page, pageCount))

    const pages = []
    let i

    if (pageCount > 3) {
      pages.push('.')
    }

    const start = Math.max(1, Math.min(pageCount - 4, page - 2))
    const end = Math.min(pageCount, Math.max(page + 2, 5))
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

  getPage = (page) => {
    this.setState({
      loadingStatus: 1
    })

    this.props.getMediumListPage({
      page,
      success: () => this.setState({
        loadingStatus: 10
      }),
      fail: () => this.setState({
        loadingStatus: -1
      }),
    })
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
    const { loadingStatus } = this.state

    return (
      <AdminLayout>
        <h2 className="mb-5">Media Library</h2>

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus !== -1 && <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {mediumListPage.map(medium => (
              <tr key={medium.get('pk')}>
                <th scope="row">{medium.get('pk')}</th>
                <td>{medium.get('type')}</td>
                <td>{medium.get('url')}</td>
              </tr>
            ))}
          </tbody>
        </table>}

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
