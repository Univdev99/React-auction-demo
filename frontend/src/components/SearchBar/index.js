import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Input, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'

import IconSearch from 'icons/IconSearch'


const COMPONENT_CLASS = 'search-bar'
const bem = (suffix) => `${COMPONENT_CLASS}__${suffix}`

const renderField = ({
  input,
  meta: { error, touched },
  placeholder,
}) => (
  <div className={bem('input-group')}>
    <span className={bem('icon')}>
      <IconSearch />
    </span>
    <Input
      className={bem('input')}
      size="lg"
      type="text"
      autoComplete="off"
      placeholder={placeholder}
      {...input}
    />
  </div>
)

class SearchBar extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    initialValue: PropTypes.string,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string
  };

  constructor(props) {
    super(props)

    this.state = {
      value: props.initialValue
    }
  }

  handleSearch = (values) => {
    const { onSearch } = this.props
    onSearch(values.get('search'))
  }

  render() {
    const { handleSubmit, placeholder } = this.props

    return (
      <form onSubmit={handleSubmit(this.handleSearch)} className={COMPONENT_CLASS}>
        <Row>
          <Col xs={12} md={10} className="mb-3 mb-md-0">
            <Field
              name="search"
              placeholder={placeholder || 'Search'}
              component={renderField}
            />
          </Col>
          <Col xs={12} md={2}>
            <Button block color="primary" size="lg" type="submit">
              Search
            </Button>
          </Col>
        </Row>
      </form>
    )
  }
}

const selector = (state, props) => ({
  initialValues: { search: props.initialValue || '' }
})

export default compose(
  connect(selector),
  reduxForm({
    form: 'searchBarForm',
    enableReinitialize: true
  })
)(SearchBar)
