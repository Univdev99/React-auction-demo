import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import StyleButton from './StyleButton'


const INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
]


class InlineStyleControls extends PureComponent {

  static propTypes = {
    editorState: PropTypes.object.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  render() {
    const { editorState, onToggle } = this.props
    var currentStyle = editorState.getCurrentInlineStyle()

    return (
      <div className="RichEditor-controls">
        {INLINE_STYLES.map(type =>
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={onToggle}
            style={type.style}
          />
        )}
      </div>
    )
  }
}

export default InlineStyleControls
