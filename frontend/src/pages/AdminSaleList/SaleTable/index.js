import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Table,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'

import Spinner from 'components/Spinner'

class SaleTable extends PureComponent {

  static propTypes = {
    columnList: ImmutablePropTypes.list.isRequired,
    saleList: ImmutablePropTypes.list.isRequired,
    loadingStatus: PropTypes.number.isRequired,
    onUpdate: PropTypes.func,
  }

  state = {
    note: '',
    notePopupOpen: false
  }

  handleClickEdit = (id, event) => {
    event.preventDefault()

    ///
  }

  cellValue = (sale, field) => {
    const value = sale.get(field)

    if (field === 'price') {
      return `$${value}`
    }
    return value
  }

  render() {
    const { loadingStatus, columnList, saleList } = this.props

    return (
      <div className="mt-2">
        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <Table responsive className="data-table mb-0">
          <thead>
            <tr>
              {columnList.filter(
                column => column.get('enabled')
              ).map(column => (
                <th key={column.get('field')}>{column.get('label')}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {saleList.map(sale => {
              return (
                <tr key={sale.get('pk')}>
                  {columnList.filter(
                    column => column.get('enabled')
                  ).map(column => (
                    <td key={column.get('field')}>{this.cellValue(sale, column.get('field'))}</td>
                  ))}
                  <td>
                    <UncontrolledDropdown>
                      <DropdownToggle size="sm" color="link" className="py-0">
                        <i className="fa fa-pencil" />
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          to="/"
                          onClick={this.handleClickEdit.bind(this, sale.get('pk'))}
                        >
                          <strong>Edit</strong>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>}
      </div>
    )
  }

}

export default SaleTable
