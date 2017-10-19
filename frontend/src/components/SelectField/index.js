import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'


class SelectField extends PureComponent {

  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    label: PropTypes.string,
    helpText: PropTypes.string,
  }

  render() {
    const {
      input,
      meta,
      label,
      helpText,
      options,
    } = this.props
    const { name, onChange, value } = input
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
        <select className="form-control" name={name} onChange={onChange} value={value}>
          <option value={''}>-- Please select an option --</option>
          {options.map(option => (
            <option key={option.key} value={option.key}>{option.value}</option>
          ))}
        </select>
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

export default SelectField
