import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'


class StyleButton extends PureComponent {

  static propTypes = {
    style: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
  }

  onToggle = (e) => {
    e.preventDefault()
    this.props.onToggle(this.props.style)
  }

  render() {
    let className = 'RichEditor-styleButton'
    if (this.props.active) {
      className += ' RichEditor-activeButton'
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    )
  }
}

export default StyleButton
