import React, { PureComponent } from 'react'
import { Alert } from 'reactstrap'
import { compose } from 'redux'
import { reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Immutable from 'immutable'

import FormField from 'components/FormField'
import InputField from 'components/InputField'


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

    return (
      <form onSubmit={handleSubmit}>
        {submitFailed && <Alert color="danger">
          {error || 'Failed to create an auction'}
        </Alert>}

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
        <FormField
          name="charity"
          label="Charity:"
          type="select"
          component={InputField}
          options={charityListOptions}
        />
        <center>
          {onBack && <button className="btn mr-3" onClick={this.handleClickBack}>
            Back
          </button>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {initialValues ? 'Update' : 'Create'}
          </button>
        </center>
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