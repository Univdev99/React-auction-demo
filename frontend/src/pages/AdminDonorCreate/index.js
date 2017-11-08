import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { withRouter } from 'react-router'
import RichTextEditor from 'react-rte'

import DonorForm from 'components/DonorForm'
import Spinner from 'components/Spinner'
import { getCharityList } from 'store/modules/admin/charities'
import { createDonor } from 'store/modules/admin/donors'
import { adminCharitiesSelector } from 'store/selectors'


class AdminDonorCreate extends PureComponent {

  static propTypes = {
    adminCharities: ImmutablePropTypes.map.isRequired,
    getCharityList: PropTypes.func.isRequired,
    createDonor: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    creatingStatus: 0,
  }

  handleSubmit = (data) => {
    const formData = data.set(
      'description',
      data.get('description').toString('html')
    )

    this.setState({
      creatingStatus: 1
    })

    this.props.createDonor({
      data: formData,
      success: ({ data }) => {
        this.props.history.push({
          pathname: `/admin/donors/${data.pk}`
        })
      },
      fail: () => {
        this.setState({
          creatingStatus: -1
        })
      }
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
  }

  render() {
    const { adminCharities } = this.props
    const charityListLoaded = adminCharities.get('charityListLoaded')
    const charityList = adminCharities.get('charityList')
    const { creatingStatus } = this.state

    const _donorDetail = Immutable.Map({
      description: RichTextEditor.createEmptyValue()
    })

    return (
      <div>
        <div>
          <h3 className="mb-5">Create Donor</h3>

          {!charityListLoaded && <Spinner />}

          {charityListLoaded && <div>
            {creatingStatus === -1 && <div className="mb-2 text-danger">
              Failed to create donor
            </div>}

            <DonorForm
              initialValues={_donorDetail}
              charityList={charityList}
              disabled={creatingStatus === 1}
              onSubmit={this.handleSubmit}
              onBack={this.handleBack}
            />
          </div>}
        </div>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  adminCharities: adminCharitiesSelector,
})

const actions = {
  getCharityList,
  createDonor,
}

export default compose(
  withRouter,
  connect(selector, actions)
)(AdminDonorCreate)
