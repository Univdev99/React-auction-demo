import React, { PureComponent } from 'react'
import { Alert, Button } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Immutable from 'immutable'

import FormField from 'components/FormField'
import InputField from 'components/InputField'
import {
  AUCTION_STATUS_WAITING_FOR_PAYMENT,
  AUCTION_STATUS_WAITING_TO_SHIP,
  AUCTION_STATUS_SHIPPED,
  AUCTION_STATUS_FINISHED,
} from 'config'


class AuctionForm extends PureComponent {

  static propTypes = {
    error: PropTypes.any,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: ImmutablePropTypes.map,
    onBack: PropTypes.func,
    productList: ImmutablePropTypes.list.isRequired,
    charityList: ImmutablePropTypes.list,
    getCharityList: PropTypes.func,
    submitFailed: PropTypes.bool,
    submitting: PropTypes.bool,
  }

  handleClickBack = (e) => {
    e.preventDefault()

    const { onBack } = this.props
    if (onBack) {
      onBack()
    }
  }

  handleChangeProduct = (event, productId) => {
    const { getCharityList } = this.props
    if (getCharityList) {
      getCharityList(productId)
    }
  }

  render() {
    const {
      error, handleSubmit, initialValues, submitFailed, submitting,
      onBack, productList, charityList,
    } = this.props

    const charityListOptions = charityList ?
      charityList.map(product => ({
        key: product.get('pk'),
        value: product.get('title'),
      })) :
      Immutable.List()

    const auctionUpdatableStatus = Immutable.Map({
      [AUCTION_STATUS_WAITING_FOR_PAYMENT]: 'Waiting for payment',
      [AUCTION_STATUS_WAITING_TO_SHIP]: 'Waiting to ship',
      [AUCTION_STATUS_SHIPPED]: 'Shipped',
      [AUCTION_STATUS_FINISHED]: 'Finished',
    })

    const statusUpdatable = (
      initialValues && (
        initialValues.get('status') === AUCTION_STATUS_WAITING_FOR_PAYMENT ||
        initialValues.get('status') === AUCTION_STATUS_WAITING_TO_SHIP ||
        initialValues.get('status') === AUCTION_STATUS_SHIPPED
      )
    )

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Failed to create an auction'}
        </Alert>}

        <div className="bordered-box no-bottom-padding">
          <FormField
            name="title"
            type="text"
            label="Title:"
            component={InputField}
          />
          <FormField
            name="starting_price"
            type="number"
            label="Starting Price:"
            component={InputField}
          />
          <FormField
            name="product"
            label="Product:"
            type="select"
            component={InputField}
            options={productList.map(product => ({
              key: product.get('pk'),
              value: product.get('title'),
            }))}
            onChange={this.handleChangeProduct}
          />
          {!statusUpdatable && <FormField
            name="charity"
            label="Charity (selected from charities of product donor):"
            type="select"
            component={InputField}
            options={charityListOptions}
          />}
          {statusUpdatable && <FormField
            name="status"
            label="Status:"
            type="select"
            component={InputField}
            options={auctionUpdatableStatus.map((status, index) => ({
              key: index,
              value: status,
            }))}
          />}
        </div>

        <div className="mt-4 text-right">
          {onBack && <Button className="mr-3" onClick={this.handleClickBack}>
            Back
          </Button>}
          <Button type="submit" color="primary" disabled={submitting}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    )
  }
}

const validate = (values) => {
  const errors = {}

  if (!values.get('title')) {
    errors.title = 'Title is required'
  }

  if (!values.get('starting_price')) {
    errors.starting_price = 'Starting price is required'
  }

  const startingPrice = parseFloat(values.get('starting_price'))
  if (startingPrice <= 0) {
    errors.starting_price = 'Starting price should be positive number'
  }

  if (!values.get('product')) {
    errors.product = 'Please select a product'
  }

  if (!values.get('charity')) {
    errors.charity = 'Please select a charity'
  }

  if (!values.get('tagnames') || !values.get('tagnames').size) {
    errors.tagnames = 'Please enter at least one tag'
  }

  return errors
}

export default compose(
  reduxForm({
    form: 'auctionForm',
    validate,
  })
)(AuctionForm)