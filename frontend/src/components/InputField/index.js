import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'


class InputField extends PureComponent {

  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    type: PropTypes.string,
    label: PropTypes.string,
    helpText: PropTypes.string,
  }

  static defaultProps = {
    type: 'text',
  }

  render() {
    const {
      input,
      meta,
      type,
      label,
      helpText,
    } = this.props
    const { name, onChange, value } = input

    return (
      <div className="form-group">
        {label && <label htmlFor={name}>{label}</label>}
        <input className="form-control" type={type} name={name} onChange={onChange} value={value} />
        {meta.error && <small className="form-text text-danger">
          {meta.error}
        </small>}
        {helpText && !meta.error && <small className="form-text text-muted">
          {helpText}
        </small>}
      </div>
    )
  }
}

export default InputField
