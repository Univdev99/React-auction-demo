import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'


class TextareaField extends PureComponent {

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
        <textarea className="form-control" type={type} name={name} onChange={onChange} value={value} rows={5} />
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

export default TextareaField
