import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Link } from 'react-router-dom'
import {
  Nav, NavItem, NavLink,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'

import Pagination from 'components/Pagination'
import {
  getSaleList,
  updateSale,
} from 'store/modules/admin/sales'
import { adminSalesSelector } from 'store/selectors'
import {
  ADMIN_TABLE_PAGE_SIZE,
} from 'config'
import SaleTable from './SaleTable'


class AdminSaleList extends PureComponent {

  static propTypes = {
    adminSales: ImmutablePropTypes.map.isRequired,
    getSaleList: PropTypes.func.isRequired,
    updateSale: PropTypes.func.isRequired,
  }

  state = {
    loadingStatus: 1,
    columnMenuOpen: false,
    columnList: Immutable.fromJS([
      { field: 'winner', label: 'Winner', enabled: true },
      { field: 'price', label: 'Final bid', enabled: true },
      { field: 'charity', label: 'Charity', enabled: true },
      { field: 'item_sent', label: 'Item sent', enabled: true },
      { field: 'tracking_number', label: 'Tracking number', enabled: true },
      { field: 'status', label: 'Status', enabled: true },
      { field: 'note', label: 'Note', enabled: true },
    ])
  }

  loadData = (page = 0) => {
    const { adminSales } = this.props
    const saleListPageNumber = adminSales.get('saleListPageNumber')

    this.setState({
      loadingStatus: 1
    }, () => {
      this.props.getSaleList({
        page: page ? page : saleListPageNumber,
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

  handleUpdate = (id) => {
    this.props.updateSale({
      id,
      data: {
        note: 'some note here' ///
      },
      fail: () => {
        alert('Failed to finish sale')
      },
    })
  }

  componentWillMount() {
    this.loadData(1)
  }

  render() {
    const { adminSales } = this.props
    const saleListPage = adminSales.get('saleListPage')
    const saleListPageNumber = adminSales.get('saleListPageNumber')
    const saleCount = adminSales.get('saleCount')
    const { loadingStatus, columnMenuOpen, columnList } = this.state

    return (
      <div>
        <div className="mb-5 clearfix">
          <h2 className="pull-left">Sales</h2>
          <Link className="btn btn-primary pull-right" to="/admin/sales/create">Create</Link>
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

          <SaleTable
            loadingStatus={loadingStatus}
            columnList={columnList}
            saleList={saleListPage}
            onUpdate={this.handleUpdate}
          />
          <div className="mt-5 text-center">
            <Pagination
              currentPage={saleListPageNumber}
              totalCount={saleCount}
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
  adminSales: adminSalesSelector,
})

const actions = {
  getSaleList,
  updateSale,
}

export default compose(
  connect(selector, actions)
)(AdminSaleList)
