import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Field, getFormValues, reduxForm } from 'redux-form/immutable'
import { FormattedNumber } from 'react-intl'

import IconArrowLeft from 'icons/IconArrowLeft'
import IconFilter from 'icons/IconFilter'
import InputField from 'components/InputField'
import SelectField from 'components/SelectField'
import SliderField from 'components/SliderField'
import { getDonorListPage } from 'store/modules/donors'

const sortByOptions = [
  { value: 'title', label: 'Auction Name' },
  { value: 'bid_price', label: 'Price' },
  { value: 'started_at', label: 'Start Date' },
  { value: 'open_until', label: 'End Date' },
]

const sortDirOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' }
]

const COMPONENT_CLASS = 'auction-side-filter'
const bemE = (suffix) => `${COMPONENT_CLASS}__${suffix}`
const bemM = (suffix) => `${COMPONENT_CLASS}--${suffix}`

class AuctionSideFilter extends PureComponent {

  static propTypes = {
    formValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  handleToggle = () => {
    const { isOpen } = this.state
    this.setState({ isOpen: !isOpen })
  }

  queryDonors = (input, callback) => {
    const { getDonorListPage } = this.props
    getDonorListPage({
      params: {
        q: input || undefined
      },
      success: (res) => {
        callback(null, {
          options: res.data.results.map(item => ({
            label: item.title,
            value: item.pk
          })),
          complete: true
        })
      }
    })
  }

  render() {
    const { formValues, handleSubmit } = this.props
    const { isOpen } = this.state

    return (
      <div className={cx(COMPONENT_CLASS, { [bemM('open')]: isOpen })}>
        <Button color="primary" className={bemE('handle')} onClick={this.handleToggle}>
          {isOpen ? <IconArrowLeft /> : <IconFilter />}
        </Button>
        <form onSubmit={handleSubmit}>
          <Field
            name="donor"
            type="text"
            label="From:"
            async
            multi
            component={SelectField}
            loadOptions={this.queryDonors}
            placeholder="Donors..."
          />
          <Field
            name="order_by"
            label="Sort By:"
            searchable={false}
            clearable={false}
            component={SelectField}
            options={sortByOptions}
          />
          <Field
            placeholder="ASC / DESC"
            name="order_dir"
            searchable={false}
            clearable={false}
            component={SelectField}
            options={sortDirOptions}
          />
          <Field
            label="Price Range:"
            type="checkbox"
            name="price_range_enabled"
            component={InputField}
          />
          {formValues && formValues.get('price_range_enabled') &&
            <Field
              min={0}
              max={2000}
              type="range"
              name="price_range"
              tipFormatter={value => <FormattedNumber value={value} format='currency' />}
              component={SliderField}
            />
          }
          <div className="text-center">
            <Button block color="primary" type="submit">
              Apply
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

const selector = createStructuredSelector({
  formValues: getFormValues('auctionFilterForm'),
})

const actions = {
  getDonorListPage
}

export default compose(
  reduxForm({
    form: 'auctionFilterForm',
    enableReinitialize: true
  }),
  connect(selector, actions)
)(AuctionSideFilter)
