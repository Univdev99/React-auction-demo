import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {
  Table, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap'
import { Link } from 'react-router-dom'

import Spinner from 'components/Spinner'
import { formatDateTime } from 'utils/formatter'


class PostTable extends PureComponent {

  static propTypes = {
    columnList: ImmutablePropTypes.list.isRequired,
    postList: ImmutablePropTypes.list.isRequired,
    loadingStatus: PropTypes.number.isRequired,
    onMoveToTrash: PropTypes.func,
  }

  cellValue = (post, field) => {
    const value = post.get(field)

    if (field === 'status') {
      return post.get('visibility')
    } else if (field === 'tagnames') {
      return post.get('tagnames').join(', ')
    } else if (field === 'created_at') {
      return formatDateTime(value)
    }
    return value
  }

  handleMoveToTrash = (id, event) => {
    event.preventDefault()

    if (!window.confirm('Are you sure to move this post to trash?')) {
      return
    }

    this.props.onMoveToTrash(id)
  }

  render() {
    const { loadingStatus, columnList, postList } = this.props

    return (
      <div className="mt-2">
        {loadingStatus === 1 && <Spinner />}

        {loadingStatus === -1 && <div>
          Failed to load data.
        </div>}

        {loadingStatus === 10 && <div className="responsive-table-wrapper">
          <Table striped className="data-table mb-0">
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
              {postList.map(post => {
                const id = post.get('pk')

                return (
                  <tr key={id}>
                    {columnList.filter(
                      column => column.get('enabled')
                    ).map(column => (
                      <td key={column.get('field')}>{this.cellValue(post, column.get('field'))}</td>
                    ))}
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <UncontrolledDropdown tag="span">
                        <DropdownToggle size="sm" color="link" className="py-0 text-black">
                          <i className="fa fa-ellipsis-h" />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            to={`/admin/posts/${id}`}
                            tag={Link}
                          >
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            to="/"
                            onClick={this.handleMoveToTrash.bind(this, id)}
                          >
                            Move to trash
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>}
      </div>
    )
  }

}

export default PostTable
