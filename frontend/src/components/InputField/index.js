import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'


class InputField extends PureComponent {

  static propTypes = {
    input: PropTypes.object.isRequired,
    type: PropTypes.string,
  }

  static defaultProps = {
    type: 'text',
  }

  render() {
    const {
      input: { name, onChange, value },
      type,
    } = this.props

    return (
      <div className="form-group">
        
        <input className="form-control" type={type} name={name} onChange={onChange} value={value} />
      </div>
    )
  }
}

export default InputField
