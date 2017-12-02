import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Nav, NavItem, NavLink,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import { Link } from 'react-router-dom'

import Pagination from 'components/Pagination'
import SectionTitle from 'components/SectionTitle'
import {
  getPostList,
} from 'store/modules/admin/blog'
import { adminBlogSelector } from 'store/selectors'
import {
  ADMIN_TABLE_PAGE_SIZE,
} from 'config'
import PostTable from './PostTable'


class AdminPostList extends PureComponent {

  static propTypes = {
    adminBlog: ImmutablePropTypes.map.isRequired,
    getPostList: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1,
    columnMenuOpen: false,
    columnList: Immutable.fromJS([
      { field: 'title', label: 'Title', enabled: true },
      { field: 'author_name', label: 'Author', enabled: true },
      { field: 'tagnames', label: 'Tags', enabled: true },
      { field: 'status', label: 'Status', enabled: true },
      { field: 'created_at', label: 'Created', enabled: true },
    ])
  }

  loadData = (page = 0) => {
    const { adminBlog } = this.props
    const postListPageNumber = adminBlog.get('postListPageNumber')

    this.setState({
      loadingStatus: 1
    }, () => {
      this.props.getPostList({
        page: page ? page : postListPageNumber,
        success: () => this.setState({
          loadingStatus: 10
        }),
        fail: () => this.setState({
          loadingStatus: -1
        }),
      })
    })
  }

  getColumnIndex = (field) => {
    const { columnList } = this.state
    const count = columnList.size

    for (let i = 0; i < count; i++) {
      const _column = columnList.get(i)
      if (_column.get('field') === field) {
        return i
      }
    }
    return -1
  }

  handleToggleColumnMenu = (e) => {
    if (e.target.classList.contains('dropdown-item')) {
      return
    }

    this.setState({
      columnMenuOpen: !this.state.columnMenuOpen
    })
  }

  handleToggleColumn = (field, event) => {
    event.preventDefault()

    const { columnList } = this.state
    const columnIndex = this.getColumnIndex(field)

    if (columnIndex >= 0) {
      const path = [columnIndex, 'enabled']
      this.setState({
        columnList: columnList.setIn(
          path,
          !columnList.getIn(path)
        )
      })
    }
  }

  handleMoveToTrash = () => {
    // 
  }

  componentWillMount() {
    this.loadData(1)
  }

  render() {
    const { adminBlog } = this.props
    const postListPage = adminBlog.get('postListPage')
    const postListPageNumber = adminBlog.get('postListPageNumber')
    const postCount = adminBlog.get('postCount')
    const { loadingStatus, columnMenuOpen, columnList } = this.state

    return (
      <div>
        <div className="mb-4 clearfix">
          <SectionTitle className="pull-left">Blog Posts</SectionTitle>
          <Link className="btn btn-primary pull-right" to="/admin/posts/create">Create</Link>
        </div>

        <div>
          <Nav pills>
            <NavItem className="ml-auto">
              <NavLink tag="span">
                <Dropdown isOpen={columnMenuOpen} toggle={this.handleToggleColumnMenu}>
                  <DropdownToggle size="sm" color="link" className="p-0 decoration-none">
                    Column Selection <i className="fa fa-chevron-down" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    {columnList.filter(
                      column => column.get('field') !== 'item_number'
                    ).map(column => (
                      <DropdownItem
                        key={column.get('field')}
                        className="position-relative"
                        onClick={this.handleToggleColumn.bind(this, column.get('field'))}
                      >
                        <div className="menu-tick">
                          {
                            column.get('enabled') ?
                            <i className="fa fa-dot-circle-o" /> :
                            <i className="fa fa-circle-o" />
                          }
                        </div>
                        {column.get('label')}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </NavLink>
            </NavItem>
          </Nav>

          <PostTable
            loadingStatus={loadingStatus}
            columnList={columnList}
            postList={postListPage}
            onMoveToTrash={this.handleMoveToTrash}
          />
          <div className="mt-5 text-center">
            <Pagination
              currentPage={postListPageNumber}
              totalCount={postCount}
              pageSize={ADMIN_TABLE_PAGE_SIZE}
              onPage={this.loadData}
            />
          </div>
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminBlog: adminBlogSelector,
})

const actions = {
  getPostList,
}

export default compose(
  connect(selector, actions)
)(AdminPostList)
