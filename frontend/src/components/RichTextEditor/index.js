import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState } from 'draft-js'
import 'draft-js/dist/Draft.css'


class RichTextEditor extends PureComponent {

  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  }

  render() {
    const { value, onChange, placeholder } = this.props

    return (
      <Editor
        editorState={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    )
  }
}

export default RichTextEditor
