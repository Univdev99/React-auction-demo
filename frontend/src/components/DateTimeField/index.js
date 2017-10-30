import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import './style.css'


class DateTimeField extends PureComponent {

  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string,
    helpText: PropTypes.string,
  }

  handleChange = (date) => {
    const { onChange } = this.props.input
    onChange(date ? date.toISOString() : null)
  }

  getValue = () => {
    const { value } = this.props.input
    return value ? moment(value) : null
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
        <DatePicker
          className="form-control"
          selected={this.getValue()}
          onChange={this.handleChange}
          showTimeSelect
          inline={false}
          dateFormat="LLL" />
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

export default DateTimeField
