import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PropTypes from 'prop-types'
import Immutable from 'immutable'

import SectionTitle from 'components/SectionTitle'
import Spinner from 'components/Spinner'
import SaleForm from 'components/SaleForm'
import {
  getSaleDetail,
  updateSaleDetail,
} from 'store/modules/admin/sales'
import { adminSalesSelector } from 'store/selectors'


class AdminSaleDetail extends PureComponent {

  static propTypes = {
    getSaleDetail: PropTypes.func.isRequired,
    updateSaleDetail: PropTypes.func.isRequired,
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

    this.props.updateSaleDetail({
      id: this.props.match.params.id,
      data,
      success: this.handleBack,
      fail: () => this.setState({
        updatingStatus: -1
      }),
    })
  }

  handleBack = () => this.props.history.push({
    pathname: '/admin/sales'
  })

  componentWillMount() {
    this.setState({
      loadingStatus: 1
    })

    this.props.getSaleDetail({
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
    const { adminSales } = this.props
    let saleDetail = adminSales.get('saleDetail')
    saleDetail = Immutable.Map({
      'item_sent': saleDetail.get('item_sent'),
      'tracking_number': saleDetail.get('tracking_number'),
      'status': saleDetail.get('status'),
    })
    const { loadingStatus, updatingStatus } = this.state

    if (loadingStatus === -1) {
      return (
        <div>
          <SectionTitle>Sale not found</SectionTitle>
        </div>
      )
    }

    return (
      <div>
        <div>
          <SectionTitle className="mb-5">Edit Sale</SectionTitle>

          {(loadingStatus === 1 || !saleDetail) && <Spinner />}

          {loadingStatus === 10 && saleDetail && <div>
            {updatingStatus === -1 && <div className="mb-2 text-danger">
              Failed to update sale
            </div>}

            <SaleForm
              initialValues={saleDetail.delete('pk')}
              disabled={updatingStatus === 1}
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
  adminSales: adminSalesSelector,
})

const actions = {
  getSaleDetail,
  updateSaleDetail,
}

export default compose(
  connect(selector, actions)
)(AdminSaleDetail)
