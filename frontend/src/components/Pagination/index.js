import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Pagination as ReactstrapPagination,
  PaginationItem, PaginationLink,
} from 'reactstrap'
import cx from 'classnames'
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left'
import FaLongArrowRight from 'react-icons/lib/fa/long-arrow-right'


class Pagination extends PureComponent {

  static propTypes = {
    onPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
  }

  getPageCount = () => {
    const { totalCount, pageSize } = this.props
    return Math.max(Math.ceil(totalCount / pageSize), 1)
  }

  getPageNumbers = (page) => {
    let pageCount = this.getPageCount()
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

  handleClickPageLink = (page, event) => {
    if (event) {
      event.preventDefault()
    }

    this.props.onPage(page)
  }

  render() {
    const { currentPage } = this.props

    return (
      <ReactstrapPagination className="justify-content-center pagination-component">
        <PaginationItem className="pr-2">
          <PaginationLink className="arrow-link" href="#" onClick={this.handleClickPageLink.bind(this, 1)}>
            <FaLongArrowLeft />
          </PaginationLink>
        </PaginationItem>
        {this.getPageNumbers(currentPage).map(pageNumber => {
          const ellipsis = (pageNumber === '.' || pageNumber === '..')
          return (
            <PaginationItem key={pageNumber} disabled={ellipsis} className={cx({ 'active': pageNumber === currentPage })}>
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
        <PaginationItem className="pl-2">
          <PaginationLink className="arrow-link" href="#" onClick={this.handleClickPageLink.bind(this, this.getPageCount())}>
            <FaLongArrowRight />
          </PaginationLink>
        </PaginationItem>
      </ReactstrapPagination>
    )
  }
}

export default Pagination
