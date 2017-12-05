import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'


class Select extends PureComponent {
  static propTypes = {
    async: PropTypes.bool,
    creatable: PropTypes.bool,
    className: PropTypes.string,
    onBlur: PropTypes.func,
    options: PropTypes.array,
    size: PropTypes.string,
    valid: PropTypes.bool,
    value: PropTypes.any,
  }

  handleChange = (option) => {
    const { onChange } = this.props
    const value = option.constructor === Array
      ? option.map((item) => item.value)
      : option.value
    onChange(value)
  }

  handleBlur = () => {
    const { onBlur, value } = this.props
    onBlur && onBlur(value)
  }

  render () {
    const { async, className, creatable, size, valid, ...props } = this.props
    const SelectComponent = async
      ? creatable
        ? ReactSelect.AsyncCreatable
        : ReactSelect.Async
      : ReactSelect

    return (
      <div
        className={cx('select-wrapper', className, {
          [`select-wrapper--${size}`]: !!size
        })}
      >
        <SelectComponent
          {...props}
          className={cx({
            'is-valid': !!valid,
            'is-invalid': valid === false
          })}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </div>
    )
  }
}

export default Select
