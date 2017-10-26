import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'


class TagsInputField extends PureComponent {

  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string,
    helpText: PropTypes.string,
  }

  handleChange = (value, changed, index) => {
    this.props.input.onChange(Immutable.fromJS(value))
  }

  value = () => {
    const value = this.props.input.value
    return value ? value.toJS() : []
  }

  render() {
    const {
      input,
      meta,
      label,
      helpText,
    } = this.props
    const { name } = input
    const fieldError = meta.invalid
    const errorClasses = ['form-text']
    if (meta.pristine) {
      errorClasses.push('text-muted')
    } else {
      errorClasses.push('text-danger')
    }

    return (
      <div className="form-group">
        {label && <label htmlFor={name}>{label}</label>}
        <TagsInput
          name={name}
          onChange={this.handleChange}
          value={this.value()}
        />
        {fieldError && <small className={errorClasses.join(' ')}>
          {meta.error}
        </small>}
        {helpText && !fieldError && <small className="form-text text-muted">
          {helpText}
        </small>}
      </div>
    )
  }
}

export default TagsInputField
